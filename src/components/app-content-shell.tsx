import { useCart } from '@/context/cart-provider';
import type { ReactNode } from 'react';
import { useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { CartSummary } from './cart-summary';
import { MenuSearch } from './menu-search';
import { MobileBottomNavigation } from './mobile-bottom-navigation';

export interface AppContentShellProps {
  children: ReactNode;
}

export function AppContentShell(
  props: AppContentShellProps,
): React.JSX.Element {
  const location = useLocation();
  const { cart, cartRevision } = useCart();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const cartItemCount = cart.reduce((count, item) => count + item.count, 0);
  const isHomeActive = location.pathname === '/';
  const isCartActive = location.pathname === '/cart';

  const closeSearch = (): void => {
    setIsSearchOpen(false);
    window.requestAnimationFrame(() => searchTriggerRef.current?.focus());
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-black to-purple-700">
      <div className="mx-auto max-w-3xl pb-[calc(1rem+env(safe-area-inset-bottom))] md:pb-0">
        {props.children}
      </div>
      <MobileBottomNavigation
        searchTriggerRef={searchTriggerRef}
        cartItemCount={cartItemCount}
        isCartActive={isCartActive}
        isSearchOpen={isSearchOpen}
        isHomeActive={isHomeActive}
        onSearchClick={() => setIsSearchOpen(true)}
      />
      <CartSummary
        cart={cart}
        revision={cartRevision}
      />
      <MenuSearch
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </div>
  );
}
