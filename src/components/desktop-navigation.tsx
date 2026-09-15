import { visibleMenu } from '@/domain/menu';
import { ChevronRight, Home, Search, ShoppingCart } from 'lucide-react';
import type { MouseEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';

export interface DesktopNavigationProps {
  cartItemCount: number;
  isCartActive: boolean;
  isHomeActive: boolean;
  isSearchOpen: boolean;
  onSearchClick: (event: MouseEvent<HTMLButtonElement>) => void;
}

/** Persistent category navigation shown on wider screens. */
export function DesktopNavigation(
  props: DesktopNavigationProps,
): React.JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();
  const routeFromPath = location.pathname.split('/')[1] ?? '';
  const activeRoute = routeFromPath;

  const selectCategory = (route: string): void => {
    navigate(`/${route}`);
  };

  return (
    <aside
      className={`hidden lg:block ${routeFromPath === '' ? 'pt-96' : 'pt-28'}`}>
      <nav
        aria-label="Categorias do cardápio"
        className="sticky top-8 px-1 text-white">
        <p className="mb-2 px-1 text-lg font-medium text-white">Categorias</p>
        <div className="mb-4 grid grid-cols-3 gap-1 border-b border-white/15 pb-3">
          <Link
            aria-current={props.isHomeActive ? 'page' : undefined}
            aria-label="Início"
            className="grid min-h-11 place-items-center rounded-xl hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            to="/">
            <Home
              aria-hidden="true"
              className="size-5"
            />
          </Link>
          <button
            aria-expanded={props.isSearchOpen}
            aria-haspopup="dialog"
            aria-label="Buscar"
            className="grid min-h-11 place-items-center rounded-xl hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            type="button"
            onClick={props.onSearchClick}>
            <Search
              aria-hidden="true"
              className="size-5"
            />
          </button>
          <Link
            aria-current={props.isCartActive ? 'page' : undefined}
            aria-label="Carrinho"
            className="relative grid min-h-11 place-items-center rounded-xl hover:bg-white/15 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            to="/cart">
            <ShoppingCart
              aria-hidden="true"
              className="size-5"
            />
            {props.cartItemCount > 0 && (
              <span className="absolute top-0 right-1 grid min-h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[0.7rem] font-bold text-white">
                {props.cartItemCount}
              </span>
            )}
          </Link>
        </div>
        <ul className="flex flex-col gap-1">
          {visibleMenu.map(entry => {
            const isActive = activeRoute === entry.route;
            return (
              <li key={entry.route}>
                <Link
                  aria-current={isActive ? 'page' : undefined}
                  className={`flex min-h-11 items-center justify-between rounded-md px-4 py-2 text-sm font-medium transition-[background-color,color,transform] duration-300 ease-out focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none ${isActive ? 'translate-x-1 bg-amber-500 text-white' : 'text-white/70 hover:bg-zinc-700/50 hover:text-white'}`}
                  to={`/${entry.route}`}
                  onClick={event => {
                    event.preventDefault();
                    selectCategory(entry.route);
                  }}>
                  <span>{entry.name}</span>
                  <ChevronRight
                    aria-hidden="true"
                    className="size-4 opacity-60"
                  />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
