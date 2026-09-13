import { Home, Search, ShoppingCart } from 'lucide-react';
import type { MouseEvent, RefObject } from 'react';
import { Link } from 'react-router';

export interface MobileNavigationProps {
  cartItemCount: number;
  isSearchOpen: boolean;
  isCartActive: boolean;
  isHomeActive: boolean;
  searchTriggerRef: RefObject<HTMLButtonElement | null>;
  onSearchClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

const itemClassName =
  'relative flex min-h-11 min-w-16 flex-1 flex-col items-center justify-center gap-0.5 rounded-lg px-2 text-xs font-medium transition duration-150 ease-out active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none';

export function MobileNavigation(
  props: MobileNavigationProps,
): React.JSX.Element {
  return (
    <nav
      aria-label="Navegação principal"
      className="fixed inset-x-0 bottom-0 z-30 border-t border-white/20 bg-purple-950/95 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] text-white shadow-2xl backdrop-blur lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch gap-2">
        <Link
          aria-current={props.isHomeActive ? 'page' : undefined}
          aria-label="Início"
          className={`${itemClassName} ${props.isHomeActive ? 'bg-white text-purple-950' : 'hover:bg-white/15'}`}
          to="/">
          <Home
            aria-hidden="true"
            className="size-5"
          />
          <span>Início</span>
        </Link>
        <button
          ref={props.searchTriggerRef}
          aria-expanded={props.isSearchOpen}
          aria-haspopup="dialog"
          aria-label="Buscar"
          className={`${itemClassName} hover:bg-white/15`}
          type="button"
          onClick={props.onSearchClick}>
          <Search
            aria-hidden="true"
            className="size-5"
          />
          <span>Buscar</span>
        </button>
        <Link
          aria-current={props.isCartActive ? 'page' : undefined}
          aria-label="Carrinho"
          className={`${itemClassName} ${props.isCartActive ? 'bg-white text-purple-950' : 'hover:bg-white/15'}`}
          to="/cart">
          <ShoppingCart
            aria-hidden="true"
            className="size-5"
          />
          <span>Carrinho</span>
          {props.cartItemCount > 0 && (
            <span className="absolute top-0 right-2 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[0.7rem] font-bold text-white">
              {props.cartItemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  );
}
