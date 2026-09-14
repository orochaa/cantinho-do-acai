import type { CartItem, CartPersistence } from '@/domain/cart';
import { createVersionedLocalStorage } from '@/lib/versioned-storage';

export const CART_STORAGE_KEY = 'cantinho-do-acai-cart';
export const CART_STORAGE_VERSION = 2;

export function createLocalStorageCartPersistence(): CartPersistence {
  const storage = createVersionedLocalStorage<{
    cart: ReadonlyArray<CartItem>;
  }>({
    key: CART_STORAGE_KEY,
    version: CART_STORAGE_VERSION,
    isValid: isValidStoredCart,
  });
  return {
    load: () => {
      const value = storage.load();
      return value
        ? { version: CART_STORAGE_VERSION, cart: value.cart }
        : undefined;
    },
    save: cart => storage.save({ cart }),
    clear: storage.clear,
  };
}

function isValidStoredCart(
  value: unknown,
): value is { cart: ReadonlyArray<CartItem> } {
  if (!(typeof value === 'object' && value !== null)) {
    return false;
  }
  const cart = (value as { cart?: unknown }).cart;
  return Array.isArray(cart) && cart.every(isValidCartItem);
}

function isValidCartItem(value: unknown): value is CartItem {
  if (!(typeof value === 'object' && value !== null)) {
    return false;
  }
  const item = value as Record<string, unknown>;
  return typeof item.id === 'string' && item.id.length > 0;
}
