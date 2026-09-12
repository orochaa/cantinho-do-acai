import type { CartItem } from '@/context/cart-provider';
import { useToast } from '@/context/toast-provider';
import { isOptionSelected, useSingleOption } from '@/hooks/use-single-option';
import { getCepAddress } from '@/lib/brasil-api';
import type {
  DeliveryAddress,
  FulfillmentMethod,
  PaymentMethod,
} from '@/lib/order';
import {
  calculateOrderChange,
  calculateOrderTotal,
  createOrder,
  createWhatsAppLink,
  validateOrder,
} from '@/lib/order';
import { useCallback, useMemo, useRef, useState } from 'react';

type SpoonOption = 'Não, obrigado' | 'Sim, por favor';

export function useCartCheckout(cart: Array<CartItem>): CartCheckoutState {
  const [paymentMethod, selectPaymentMethod] = useSingleOption<PaymentMethod>([
    { name: 'PIX', isSelected: true },
    { name: 'Cartão de Crédito' },
    { name: 'Dinheiro' },
  ]);
  const [spoonOption, selectSpoonOption] = useSingleOption<SpoonOption>([
    { name: 'Não, obrigado', isSelected: true },
    { name: 'Sim, por favor' },
  ]);
  const [checkoutOption, selectCheckoutOption] =
    useSingleOption<FulfillmentMethod>([
      { name: 'Retirada no local', isSelected: true },
      { name: 'Entrega (com taxa de entrega)' },
    ]);
  const isDelivery = isOptionSelected(
    checkoutOption.options,
    'Entrega (com taxa de entrega)',
  );
  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<DeliveryAddress | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  const cepRequestRef = useRef(0);
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [addressReference, setAddressReference] = useState('');
  const [clientName, setClientName] = useState('');
  const [cashValue, setCashValue] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useToast();
  const orderTotal = useMemo(() => calculateOrderTotal(cart), [cart]);
  const change = useMemo(
    () =>
      isOptionSelected(paymentMethod.options, 'Dinheiro')
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

  const fulfillment = isDelivery
    ? 'Entrega (com taxa de entrega)'
    : 'Retirada no local';
  const selectedPaymentMethod =
    paymentMethod.options.find(option => option.isSelected)?.name ?? 'PIX';
  const goToWhatsappLink = useMemo(
    () =>
      createWhatsAppLink({
        order: createOrder(cart),
        clientName,
        fulfillment,
        address,
        addressNumber,
        addressComplement,
        addressReference,
        paymentMethod: selectedPaymentMethod,
        cashValue,
        includeCutlery: isOptionSelected(spoonOption.options, 'Sim, por favor'),
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
      toast.error({ description: validationError });
      return;
    }
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
  checkoutOption: ReturnType<typeof useSingleOption<FulfillmentMethod>>[0];
  clientName: string;
  confirmOrder: () => void;
  fulfillment: FulfillmentMethod;
  goToWhatsappLink: string;
  handleCepChange: (value: string) => Promise<void>;
  isDelivery: boolean;
  modalOpen: boolean;
  orderTotal: number;
  paymentMethod: ReturnType<typeof useSingleOption<PaymentMethod>>[0];
  selectCheckoutOption: ReturnType<
    typeof useSingleOption<FulfillmentMethod>
  >[1];
  selectPaymentMethod: ReturnType<typeof useSingleOption<PaymentMethod>>[1];
  selectSpoonOption: ReturnType<typeof useSingleOption<SpoonOption>>[1];
  setAddressComplement: (value: string) => void;
  setAddressNumber: (value: string) => void;
  setAddressReference: (value: string) => void;
  setCashValue: (value: string) => void;
  setClientName: (value: string) => void;
  setModalOpen: (value: boolean) => void;
  spoonOption: ReturnType<typeof useSingleOption<SpoonOption>>[0];
  cep: string;
  cepLoading: boolean;
}
