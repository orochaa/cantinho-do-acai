import type { CartEvent, CartItem } from '@/domain/cart';
import { cartReducer, hydrateCart } from '@/domain/cart';
import {
  CART_STORAGE_VERSION,
  createLocalStorageCartPersistence,
} from '@/lib/cart-storage';
import type { ReactNode } from 'react';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

export type { CartEvent, CartItem } from '@/domain/cart';

interface ICartContext {
  addCartEvent: (event: CartEvent) => void;
  cart: ReadonlyArray<CartItem>;
}

const CartContext = createContext<ICartContext>({
  cart: [],
  addCartEvent() {},
});

export function CartProvider(props: {
  children: ReactNode;
}): React.JSX.Element {
  const persistence = useMemo(createLocalStorageCartPersistence, []);
  const [cart, addCartEvent] = useReducer(cartReducer, persistence, value =>
    hydrateCart(value, CART_STORAGE_VERSION),
  );

  useEffect(() => {
    try {
      persistence.save(cart);
    } catch {
      // Storage can be unavailable or full; the in-memory cart remains usable.
    }
  }, [cart, persistence]);

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
