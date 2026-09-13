import type { OrderItem } from '@/domain/order';
import { createOrderItem, updateOrderItemQuantity } from '@/domain/order';
import { exhaustive } from 'exhaustive';
import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

export interface CartItem extends OrderItem {
  id: string;
}

type CartEvent =
  | { type: 'add'; item: Omit<CartItem, 'id' | 'total'> }
  | { type: 'remove'; id: string }
  | { type: 'remove'; index: number }
  | { type: 'update-quantity'; id: string; count: number }
  | { type: 'update-quantity'; index: number; count: number };

interface ICartContext {
  addCartEvent: (event: CartEvent) => void;
  cart: Array<CartItem>;
}

const CART_STORAGE_KEY = 'cantinho-do-acai-cart';
const CART_STORAGE_VERSION = 1;

interface StoredCart {
  version: typeof CART_STORAGE_VERSION;
  cart: Array<CartItem>;
}

const CartContext = createContext<ICartContext>({
  cart: [],
  addCartEvent() {},
});

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

const isValidCartItem = (value: unknown): value is CartItem => {
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

function readStoredCart(): Array<CartItem> {
  try {
    if (typeof window === 'undefined') {
      return [];
    }
    const saved = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!saved) {
      return [];
    }
    const parsed: unknown = JSON.parse(saved);
    if (
      !isRecord(parsed) ||
      parsed.version !== CART_STORAGE_VERSION ||
      !Array.isArray(parsed.cart) ||
      !parsed.cart.every(isValidCartItem)
    ) {
      window.localStorage.removeItem(CART_STORAGE_KEY);
      return [];
    }
    return parsed.cart;
  } catch {
    try {
      window.localStorage.removeItem(CART_STORAGE_KEY);
    } catch {
      // Storage can be unavailable altogether.
    }
    return [];
  }
}

function createCartItemId(): string {
  if (
    typeof crypto !== 'undefined' &&
    typeof crypto.randomUUID === 'function'
  ) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function findItemIndex(
  state: Array<CartItem>,
  event: { id?: string; index?: number },
): number {
  if (event.id !== undefined) {
    return state.findIndex(item => item.id === event.id);
  }
  return event.index ?? -1;
}

function cartReducer(
  state: Array<CartItem>,
  event: CartEvent,
): Array<CartItem> {
  return exhaustive(event, 'type', {
    add: ({ item }) => {
      const orderItem = createOrderItem(item);

      return [...state, { ...orderItem, id: createCartItemId() }];
    },
    remove: event => {
      const index = findItemIndex(state, event);
      return index < 0 ? state : state.filter((_, i) => i !== index);
    },
    'update-quantity': event => {
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
    },
  });
}

export function CartProvider(props: {
  children: ReactNode;
}): React.JSX.Element {
  const [cart, addCartEvent] = useReducer(
    cartReducer,
    undefined,
    readStoredCart,
  );
  useEffect(() => {
    try {
      const stored: StoredCart = { version: CART_STORAGE_VERSION, cart };
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(stored));
    } catch {
      // Storage can be unavailable or full; the in-memory cart remains usable.
    }
  }, [cart]);
  const context = useMemo<ICartContext>(() => ({ cart, addCartEvent }), [cart]);
  return (
    <CartContext.Provider value={context}>
      {props.children}
    </CartContext.Provider>
  );
}

export function useCart(): ICartContext {
  return useContext(CartContext);
}
