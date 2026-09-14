import { useOptionalApp } from '@/context/app-provider';
import { useOptionalToast } from '@/context/toast-provider';
import {
  type CartEvent,
  type CartItem,
  cartReducer,
  hydrateCart,
} from '@/domain/cart';
import {
  CART_STORAGE_VERSION,
  createLocalStorageCartPersistence,
} from '@/lib/cart-storage';
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from 'react';

export type { CartEvent, CartItem } from '@/domain/cart';

interface ICartContext {
  addCartEvent: (event: CartEvent) => void;
  cart: ReadonlyArray<CartItem>;
  cartRevision: number;
}

const CartContext = createContext<ICartContext>({
  cart: [],
  addCartEvent() {},
  cartRevision: 0,
});

export function CartProvider(props: {
  children: ReactNode;
}): React.JSX.Element {
  const persistence = useMemo(createLocalStorageCartPersistence, []);
  const app = useOptionalApp();
  const toast = useOptionalToast();
  const [cart, addCartEvent] = useReducer(cartReducer, persistence, value =>
    hydrateCart(value, CART_STORAGE_VERSION),
  );
  const [cartRevision, setCartRevision] = useReducer(
    (revision: number) => revision + 1,
    0,
  );
  const dispatchCartEvent = useCallback(
    (event: CartEvent): void => {
      setCartRevision();
      addCartEvent(event);
      if (event.type === 'add') {
        app?.showCartSummary();
        toast?.success({
          title: 'Adicionado ao pedido',
          description: `${event.item.product.name} foi adicionado ao pedido.`,
          desktopOnly: true,
        });
      }
    },
    [app, toast],
  );

  useEffect(() => {
    try {
      persistence.save(cart);
    } catch {
      // Storage can be unavailable or full; the in-memory cart remains usable.
    }
  }, [cart, persistence]);

  const context = useMemo<ICartContext>(
    () => ({
      cart,
      addCartEvent: dispatchCartEvent,
      cartRevision,
    }),
    [cart, cartRevision, dispatchCartEvent],
  );
  return (
    <CartContext.Provider value={context}>
      {props.children}
    </CartContext.Provider>
  );
}

export function useCart(): ICartContext {
  return useContext(CartContext);
}
