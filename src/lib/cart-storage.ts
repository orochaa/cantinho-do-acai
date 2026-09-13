import type { CartItem, CartPersistence } from '@/domain/cart';

export const CART_STORAGE_KEY = 'cantinho-do-acai-cart';
export const CART_STORAGE_VERSION = 1;

interface StoredCart {
  version: typeof CART_STORAGE_VERSION;
  cart: ReadonlyArray<CartItem>;
}

export function createLocalStorageCartPersistence(): CartPersistence {
  return {
    load: () => {
      if (typeof window === 'undefined') {
        return;
      }
      const saved = window.localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : undefined;
    },
    save: cart => {
      if (typeof window === 'undefined') {
        return;
      }
      const stored: StoredCart = { version: CART_STORAGE_VERSION, cart };
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
    },
    clear: () => {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(CART_STORAGE_KEY);
      }
    },
  };
}
