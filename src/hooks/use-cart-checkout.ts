import { useToast } from '@/context/toast-provider';
import type { CartItem } from '@/domain/cart';
import {
  CheckoutCutleryEnum,
  CheckoutFulfillmentEnum,
  type CheckoutOption,
  type CheckoutOptionGroup,
  CheckoutPaymentEnum,
  type CheckoutSpoonOption,
  checkoutOptionsReducer,
  createCheckoutOptionsState,
} from '@/domain/checkout-state';
import {
  calculateOrderChange,
  calculateOrderTotal,
  createOrder,
  type DeliveryAddress,
  type FulfillmentMethod,
  type PaymentMethod,
  validateOrder,
} from '@/domain/order';
import { getCepAddress } from '@/lib/brasil-api';
import { checkoutStorage, loadCheckoutStorage } from '@/lib/checkout-storage';
import { createOrderCheckoutWhatsAppLink } from '@/lib/whatsapp';
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from 'react';
export type CheckoutField =
  | 'clientName'
  | 'cep'
  | 'addressNumber'
  | 'paymentMethod'
  | 'cashValue';

const getValidationField = (input: {
  clientName: string;
  isDelivery: boolean;
  address: DeliveryAddress | null;
  addressNumber: string;
  paymentMethod: PaymentMethod | null;
}): CheckoutField => {
  if (!input.clientName.trim()) {
    return 'clientName';
  }
  if (input.isDelivery && !input.address?.street.trim()) {
    return 'cep';
  }
  if (input.isDelivery && !input.addressNumber.trim()) {
    return 'addressNumber';
  }
  if (input.paymentMethod === CheckoutPaymentEnum.Cash) {
    return 'cashValue';
  }
  return 'paymentMethod';
};

export function useCartCheckout(
  cart: ReadonlyArray<CartItem>,
): CartCheckoutState {
  const [savedCheckout] = useState(loadCheckoutStorage);
  const cartSignature = cart.map(item => item.id).join('|');
  const hasSavedCartState = savedCheckout.cartSignature === cartSignature;
  const [{ groups }, dispatch] = useReducer(
    checkoutOptionsReducer,
    hasSavedCartState ? savedCheckout : undefined,
    saved =>
      createCheckoutOptionsState({
        fulfillment: saved?.fulfillment,
        paymentMethod: saved?.paymentMethod,
        cutlery: saved?.cutlery,
      }),
  );
  const {
    fulfillment: checkoutOption,
    payment: paymentMethod,
    cutlery: spoonOption,
  } = groups;
  const selectCheckoutOption = (option: CheckoutOption<FulfillmentMethod>) =>
    dispatch({ type: 'select', group: 'fulfillment', option });
  const selectPaymentMethod = (option: CheckoutOption<PaymentMethod>) =>
    dispatch({ type: 'select', group: 'payment', option });
  const selectSpoonOption = (option: CheckoutOption<CheckoutSpoonOption>) =>
    dispatch({ type: 'select', group: 'cutlery', option });
  const isDelivery =
    checkoutOption.options.find(
      option => option.name === CheckoutFulfillmentEnum.Delivery,
    )?.isSelected ?? false;
  const fulfillment = isDelivery
    ? CheckoutFulfillmentEnum.Delivery
    : CheckoutFulfillmentEnum.Pickup;
  const [cep, setCep] = useState(savedCheckout.address?.cep ?? '');
  const [address, setAddress] = useState<DeliveryAddress | null>(
    savedCheckout.address,
  );
  const [addressError, setAddressError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const cepRequestRef = useRef(0);
  const [addressNumber, setAddressNumber] = useState(
    savedCheckout.addressNumber,
  );
  const [addressComplement, setAddressComplement] = useState(
    savedCheckout.addressComplement,
  );
  const [addressReference, setAddressReference] = useState(
    savedCheckout.addressReference,
  );
  const [clientName, setClientName] = useState(savedCheckout.clientName);
  const [cashValue, setCashValue] = useState(
    hasSavedCartState ? (savedCheckout.cashValue ?? '') : '',
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [validationErrors, setValidationErrors] = useState<
    Partial<Record<CheckoutField, string>>
  >({});
  const toast = useToast();
  const skipNextStorageWrite = useRef<boolean>(false);
  useEffect(() => {
    if ((skipNextStorageWrite.current as unknown) === true) {
      skipNextStorageWrite.current = false;
      return;
    }
    checkoutStorage.save({
      clientName,
      address,
      addressNumber,
      addressComplement,
      addressReference,
      fulfillment,
      paymentMethod: paymentMethod.options.find(option => option.isSelected)
        ?.name,
      cutlery: spoonOption.options.find(option => option.isSelected)?.name,
      cashValue,
      cartSignature,
      cartStateSavedAt: Date.now(),
    });
  }, [
    address,
    addressComplement,
    addressNumber,
    addressReference,
    cashValue,
    clientName,
    cartSignature,
    fulfillment,
    paymentMethod,
    spoonOption,
  ]);
  const forgetSavedDetails = useCallback(() => {
    checkoutStorage.clear();
    skipNextStorageWrite.current = true;
    setClientName('');
    setCep('');
    setAddress(null);
    setAddressNumber('');
    setAddressComplement('');
    setAddressReference('');
    setCashValue('');
    setAddressError(null);
    setValidationErrors({});
  }, []);
  const orderTotal = useMemo(() => calculateOrderTotal(cart), [cart]);
  const change = useMemo(
    () =>
      paymentMethod.options.find(
        option => option.name === CheckoutPaymentEnum.Cash,
      )?.isSelected
        ? calculateOrderChange(cashValue, orderTotal)
        : 0,
    [cashValue, orderTotal, paymentMethod],
  );

  const handleCepChange = useCallback(async (value: string) => {
    const normalizedCep = value.replaceAll(/\D/g, '');
    const requestId = cepRequestRef.current + 1;
    cepRequestRef.current = requestId;
    setCep(normalizedCep);

    if (normalizedCep.length !== 8) {
      setAddress(null);
      setAddressError(null);
      setCepLoading(false);
      return;
    }

    setAddress(null);
    setAddressError(null);
    setCepLoading(true);

    try {
      const cepAddress = await getCepAddress(normalizedCep);
      if (cepRequestRef.current === requestId) {
        setAddress(cepAddress);
      }
    } catch (error) {
      if (cepRequestRef.current === requestId) {
        setAddress(null);
        setAddressError('CEP não encontrado.');
        console.error(error);
      }
    } finally {
      if (cepRequestRef.current === requestId) {
        setCepLoading(false);
      }
    }
  }, []);

  const selectedPaymentMethod =
    paymentMethod.options.find(option => option.isSelected)?.name ??
    CheckoutPaymentEnum.Pix;
  const goToWhatsappLink = useMemo(
    () =>
      createOrderCheckoutWhatsAppLink({
        order: createOrder(cart),
        clientName,
        fulfillment,
        address,
        addressNumber,
        addressComplement,
        addressReference,
        paymentMethod: selectedPaymentMethod,
        cashValue,
        includeCutlery:
          spoonOption.options.find(
            option => option.name === CheckoutCutleryEnum.Yes,
          )?.isSelected ?? false,
      }),
    [
      address,
      addressComplement,
      addressNumber,
      addressReference,
      cashValue,
      cart,
      clientName,
      fulfillment,
      selectedPaymentMethod,
      spoonOption,
    ],
  );
  const confirmOrder = useCallback(() => {
    const validationError = validateOrder({
      clientName,
      fulfillment,
      address,
      addressNumber,
      paymentMethod:
        paymentMethod.options.find(option => option.isSelected)?.name ?? null,
      cashValue,
      orderTotal,
    });
    if (validationError) {
      const field = getValidationField({
        clientName,
        isDelivery,
        address,
        addressNumber,
        paymentMethod:
          paymentMethod.options.find(option => option.isSelected)?.name ?? null,
      });
      setValidationErrors({ [field]: validationError });
      toast.error({ description: validationError });
      return;
    }
    setValidationErrors({});
    setModalOpen(true);
  }, [
    address,
    addressNumber,
    cashValue,
    clientName,
    fulfillment,
    orderTotal,
    paymentMethod,
    toast,
    isDelivery,
  ]);

  return {
    address,
    addressComplement,
    addressError,
    addressNumber,
    addressReference,
    cashValue,
    change,
    checkoutOption,
    clientName,
    confirmOrder,
    fulfillment,
    forgetSavedDetails,
    goToWhatsappLink,
    handleCepChange,
    isDelivery,
    modalOpen,
    orderTotal,
    paymentMethod,
    selectCheckoutOption,
    selectPaymentMethod,
    selectSpoonOption,
    setAddressComplement,
    setAddressNumber,
    setAddressReference,
    setCashValue,
    setClientName,
    setModalOpen,
    validationErrors,
    spoonOption,
    cep,
    cepLoading,
  };
}

export interface CartCheckoutState {
  address: DeliveryAddress | null;
  addressComplement: string;
  addressError: string | null;
  addressNumber: string;
  addressReference: string;
  cashValue: string;
  change: number;
  checkoutOption: CheckoutOptionGroup<FulfillmentMethod>;
  clientName: string;
  confirmOrder: () => void;
  fulfillment: FulfillmentMethod;
  forgetSavedDetails: () => void;
  goToWhatsappLink: string;
  handleCepChange: (value: string) => Promise<void>;
  isDelivery: boolean;
  modalOpen: boolean;
  validationErrors?: Partial<Record<CheckoutField, string>>;
  orderTotal: number;
  paymentMethod: CheckoutOptionGroup<PaymentMethod>;
  selectCheckoutOption: (option: CheckoutOption<FulfillmentMethod>) => void;
  selectPaymentMethod: (option: CheckoutOption<PaymentMethod>) => void;
  selectSpoonOption: (option: CheckoutOption<CheckoutSpoonOption>) => void;
  setAddressComplement: (value: string) => void;
  setAddressNumber: (value: string) => void;
  setAddressReference: (value: string) => void;
  setCashValue: (value: string) => void;
  setClientName: (value: string) => void;
  setModalOpen: (value: boolean) => void;
  spoonOption: CheckoutOptionGroup<CheckoutSpoonOption>;
  cep: string;
  cepLoading: boolean;
}
