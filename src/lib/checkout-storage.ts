import type { CheckoutSpoonOption } from '@/domain/checkout-state';
import {
  CheckoutCutleryEnum,
  CheckoutFulfillmentEnum,
  CheckoutPaymentEnum,
} from '@/domain/checkout-state';
import type {
  DeliveryAddress,
  FulfillmentMethod,
  PaymentMethod,
} from '@/domain/order';
import { createVersionedLocalStorage } from '@/lib/versioned-storage';

export const CHECKOUT_STORAGE_KEY = 'cantinho-do-acai-checkout';
export const CHECKOUT_STORAGE_VERSION = 1;
export const CHECKOUT_STATE_TTL_MS = 24 * 60 * 60 * 1000;

export interface CheckoutStorageData {
  clientName: string;
  address: DeliveryAddress | null;
  addressNumber: string;
  addressComplement: string;
  addressReference: string;
  fulfillment?: FulfillmentMethod;
  paymentMethod?: PaymentMethod;
  cutlery?: CheckoutSpoonOption;
  cashValue?: string;
  cartSignature?: string;
  cartStateSavedAt?: number;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isAddress = (value: unknown): value is DeliveryAddress =>
  isRecord(value) &&
  ['cep', 'state', 'city', 'neighborhood', 'street'].every(
    key => typeof value[key] === 'string' && value[key].trim().length > 0,
  );

const isCheckoutData = (value: unknown): value is CheckoutStorageData =>
  isRecord(value) &&
  typeof value.clientName === 'string' &&
  (value.address === null || isAddress(value.address)) &&
  typeof value.addressNumber === 'string' &&
  typeof value.addressComplement === 'string' &&
  typeof value.addressReference === 'string' &&
  (value.fulfillment === undefined ||
    Object.values(CheckoutFulfillmentEnum).includes(
      value.fulfillment as FulfillmentMethod,
    )) &&
  (value.paymentMethod === undefined ||
    Object.values(CheckoutPaymentEnum).includes(
      value.paymentMethod as PaymentMethod,
    )) &&
  (value.cutlery === undefined ||
    value.cutlery === CheckoutCutleryEnum.No ||
    value.cutlery === CheckoutCutleryEnum.Yes) &&
  (value.cashValue === undefined || typeof value.cashValue === 'string') &&
  (value.cartSignature === undefined ||
    typeof value.cartSignature === 'string') &&
  (value.cartStateSavedAt === undefined ||
    (typeof value.cartStateSavedAt === 'number' &&
      Number.isFinite(value.cartStateSavedAt)));

const expireCartState = (data: CheckoutStorageData): CheckoutStorageData => {
  if (
    data.cartStateSavedAt === undefined ||
    Date.now() - data.cartStateSavedAt <= CHECKOUT_STATE_TTL_MS
  ) {
    return data;
  }

  const {
    fulfillment: _fulfillment,
    paymentMethod: _paymentMethod,
    cutlery: _cutlery,
    cashValue: _cashValue,
    cartSignature: _cartSignature,
    cartStateSavedAt: _cartStateSavedAt,
    ...savedIdentity
  } = data;

  return savedIdentity;
};

export const emptyCheckoutStorageData = (): CheckoutStorageData => ({
  clientName: '',
  address: null,
  addressNumber: '',
  addressComplement: '',
  addressReference: '',
});

export const checkoutStorage = createVersionedLocalStorage<CheckoutStorageData>(
  {
    key: CHECKOUT_STORAGE_KEY,
    version: CHECKOUT_STORAGE_VERSION,
    isValid: isCheckoutData,
  },
);

export const loadCheckoutStorage = (): CheckoutStorageData =>
  expireCartState(checkoutStorage.load() ?? emptyCheckoutStorageData());
