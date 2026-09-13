import type { OrderItem } from '@/domain/order';
import { createOrderItem, updateOrderItemQuantity } from '@/domain/order';

export interface CartItem extends OrderItem {
  id: string;
}

export type CartEvent =
  | { type: 'add'; item: Omit<CartItem, 'id' | 'total'> }
  | { type: 'remove'; id?: string; index?: number }
  | { type: 'update-quantity'; id?: string; index?: number; count: number };

export type CartIdGenerator = () => string;

export interface CartPersistence {
  clear: () => void;
  load: () => unknown;
  save: (cart: ReadonlyArray<CartItem>) => void;
}

export const generateCartItemId: CartIdGenerator = () => {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const findItemIndex = (
  state: ReadonlyArray<CartItem>,
  event: { id?: string; index?: number },
): number =>
  event.id === undefined
    ? (event.index ?? -1)
    : state.findIndex(item => item.id === event.id);

export const createCartReducer =
  (generateId: CartIdGenerator = generateCartItemId) =>
  (
    state: ReadonlyArray<CartItem>,
    event: CartEvent,
  ): ReadonlyArray<CartItem> => {
    switch (event.type) {
      case 'add': {
        const { item } = event;
        const orderItem = createOrderItem(item);
        return [...state, { ...orderItem, id: generateId() }];
      }
      case 'remove': {
        const index = findItemIndex(state, event);
        return index < 0 || index >= state.length
          ? state
          : state.filter((_, i) => i !== index);
      }
      case 'update-quantity': {
        const index = findItemIndex(state, event);
        const item = state[index];
        if (!(item && Number.isInteger(event.count)) || event.count < 1) {
          return state;
        }
        const updatedCart = [...state];
        updatedCart[index] = {
          ...updateOrderItemQuantity(item, event.count),
          id: item.id,
        };
        return updatedCart;
      }
      default: {
        const unhandledEvent: never = event;
        throw new Error(`Unhandled cart event: ${String(unhandledEvent)}`);
      }
    }
  };

export const cartReducer = createCartReducer();

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isValidOption = (value: unknown): value is Option => {
  if (!isRecord(value)) {
    return false;
  }
  return (
    typeof value.name === 'string' &&
    typeof value.count === 'number' &&
    Number.isInteger(value.count) &&
    value.count >= 0 &&
    (value.price === undefined || typeof value.price === 'number') &&
    (value.img === undefined || typeof value.img === 'string')
  );
};

export const isValidCartItem = (value: unknown): value is CartItem => {
  if (!(isRecord(value) && isRecord(value.product))) {
    return false;
  }
  return (
    typeof value.id === 'string' &&
    value.id.length > 0 &&
    typeof value.product.name === 'string' &&
    typeof value.product.price === 'number' &&
    Array.isArray(value.options) &&
    value.options.every(isValidOption) &&
    typeof value.count === 'number' &&
    Number.isInteger(value.count) &&
    value.count > 0 &&
    (value.observation === undefined ||
      typeof value.observation === 'string') &&
    typeof value.total === 'number' &&
    Number.isFinite(value.total)
  );
};

export function hydrateCart(
  persistence: CartPersistence,
  version: number,
): ReadonlyArray<CartItem> {
  try {
    const parsed = persistence.load();
    if (
      !isRecord(parsed) ||
      parsed.version !== version ||
      !Array.isArray(parsed.cart) ||
      !parsed.cart.every(isValidCartItem)
    ) {
      persistence.clear();
      return [];
    }
    return parsed.cart;
  } catch {
    try {
      persistence.clear();
    } catch {
      /* unavailable persistence */
    }
    return [];
  }
}
