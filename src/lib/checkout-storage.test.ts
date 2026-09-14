import {
  CHECKOUT_STATE_TTL_MS,
  CHECKOUT_STORAGE_KEY,
  CHECKOUT_STORAGE_VERSION,
  checkoutStorage,
  emptyCheckoutStorageData,
  loadCheckoutStorage,
} from '@/lib/checkout-storage';
import { beforeEach, describe, expect, it } from 'vitest';

const data = {
  clientName: 'Maria',
  address: {
    cep: '95000000',
    state: 'RS',
    city: 'Caxias do Sul',
    neighborhood: 'Centro',
    street: 'Rua Nova',
  },
  addressNumber: '10',
  addressComplement: 'Apto 2',
  addressReference: 'Padaria',
};

const storage = new Map<string, string>();
const localStorageMock = {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => storage.set(key, value),
  removeItem: (key: string) => storage.delete(key),
  clear: () => storage.clear(),
};

Object.defineProperty(globalThis, 'window', {
  configurable: true,
  value: { localStorage: localStorageMock },
});

describe('checkout storage', () => {
  beforeEach(() => window.localStorage.clear());

  it('should save and load valid checkout details', () => {
    checkoutStorage.save(data);
    expect(loadCheckoutStorage()).toEqual(data);
  });

  it('should clear malformed and stale payloads', () => {
    window.localStorage.setItem(CHECKOUT_STORAGE_KEY, '{bad');
    expect(loadCheckoutStorage()).toEqual(emptyCheckoutStorageData());
    window.localStorage.setItem(
      CHECKOUT_STORAGE_KEY,
      JSON.stringify({ ...data, version: CHECKOUT_STORAGE_VERSION + 1 }),
    );
    expect(loadCheckoutStorage()).toEqual(emptyCheckoutStorageData());
    expect(window.localStorage.getItem(CHECKOUT_STORAGE_KEY)).toBeNull();
  });

  it('should clear details explicitly', () => {
    checkoutStorage.save(data);
    checkoutStorage.clear();
    expect(window.localStorage.getItem(CHECKOUT_STORAGE_KEY)).toBeNull();
  });

  it('should expire cart-specific state while retaining identity details', () => {
    checkoutStorage.save({
      ...data,
      fulfillment: 'Entrega (com taxa de entrega)',
      paymentMethod: 'Dinheiro',
      cutlery: 'Sim, por favor',
      cashValue: 'R$ 20,00',
      cartSignature: 'item-1',
      cartStateSavedAt: Date.now() - CHECKOUT_STATE_TTL_MS - 1,
    });

    const stored = loadCheckoutStorage();

    expect(stored.clientName).toBe(data.clientName);
    expect(stored.address).toEqual(data.address);
    expect(stored.fulfillment).toBeUndefined();
    expect(stored.paymentMethod).toBeUndefined();
    expect(stored.cutlery).toBeUndefined();
    expect(stored.cashValue).toBeUndefined();
    expect(stored.cartSignature).toBeUndefined();
  });
});
