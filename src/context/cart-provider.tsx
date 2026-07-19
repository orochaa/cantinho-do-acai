import { exhaustive } from 'exhaustive';
import type { ReactNode } from 'react';
import { createContext, useContext, useMemo, useReducer } from 'react';

interface CartItem {
  product: Product;
  options: Array<Option>;
  count: number;
  observation?: string;
  total: number;
}

type CartEvent =
  | {
      type: 'add';
      item: Omit<CartItem, 'total'>;
    }
  | {
      type: 'remove';
      index: number;
    }
  | {
      type: 'update-quantity';
      index: number;
      count: number;
    };

interface ICartContext {
  addCartEvent: (event: CartEvent) => void;
  cart: Array<CartItem>;
}

const CartContext = createContext<ICartContext>({
  cart: [],
  addCartEvent() {},
});

function cartReducer(
  state: Array<CartItem>,
  event: CartEvent,
): Array<CartItem> {
  return exhaustive(event, 'type', {
    add: ({ item }) => {
      let total = item.product.price;
      const options: Array<Option> = [];

      for (const option of item.options) {
        if (option.count > 0) {
          options.push(option);
          total += (option.price ?? 0) * option.count;
        }
      }

      return [...state, { ...item, options, total: total * item.count }];
    },
    remove: ({ index }) => state.filter((_, i) => i !== index),
    'update-quantity': ({ index, count }) => {
      const updatedCart = [...state];
      const item = updatedCart[index];
      let total = item.product.price;

      for (const option of item.options) {
        total += (option.price ?? 0) * option.count;
      }

      updatedCart[index] = { ...item, count, total: total * count };

      return updatedCart;
    },
  });
}

export function CartProvider(props: {
  children: ReactNode;
}): React.JSX.Element {
  const [cart, addCartEvent] = useReducer(cartReducer, []);

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
