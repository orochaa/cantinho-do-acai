import { useOptionalApp } from '@/context/app-provider';
import { useCart } from '@/context/cart-provider';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router';
import { CartSummary } from './cart-summary';
import { DesktopNavigation } from './desktop-navigation';
import { MenuSearch } from './menu-search';
import { MobileNavigation } from './mobile-navigation';

export interface AppContentShellProps {
  children: ReactNode;
}

export function AppContentShell(
  props: AppContentShellProps,
): React.JSX.Element {
  const location = useLocation();
  const { cart, cartRevision } = useCart();
  const app = useOptionalApp();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchTriggerRef = useRef<HTMLButtonElement>(null);
  const searchOriginRef = useRef<HTMLButtonElement>(null);
  const cartItemCount = cart.reduce((count, item) => count + item.count, 0);
  const isHomeActive = location.pathname === '/';
  const isCartActive = location.pathname === '/cart';

  useEffect(() => {
    const handleGlobalSearchShortcut = (event: KeyboardEvent): void => {
      const target = event.target;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (event.key.toLowerCase() !== 'q' || event.metaKey || event.ctrlKey) {
        return;
      }
      event.preventDefault();
      searchOriginRef.current = null;
      setIsSearchOpen(true);
    };

    window.addEventListener('keydown', handleGlobalSearchShortcut);
    return () =>
      window.removeEventListener('keydown', handleGlobalSearchShortcut);
  }, []);

  const closeSearch = (): void => {
    setIsSearchOpen(false);
    window.requestAnimationFrame(() => searchOriginRef.current?.focus());
  };

  return (
    <div className="relative min-h-screen bg-linear-to-br from-black to-purple-700">
      <div className="mx-auto grid max-w-6xl grid-cols-1 lg:grid-cols-[13rem_minmax(0,1fr)] lg:gap-8 lg:px-6">
        <DesktopNavigation
          cartItemCount={cartItemCount}
          isCartActive={isCartActive}
          isHomeActive={isHomeActive}
          isSearchOpen={isSearchOpen}
          onSearchClick={event => {
            searchOriginRef.current = event.currentTarget;
            setIsSearchOpen(true);
          }}
        />
        <main className="min-w-0 pb-[calc(1rem+env(safe-area-inset-bottom))] lg:pb-8">
          <div className="mx-auto max-w-3xl">{props.children}</div>
        </main>
      </div>
      <MobileNavigation
        searchTriggerRef={searchTriggerRef}
        cartItemCount={cartItemCount}
        isCartActive={isCartActive}
        isSearchOpen={isSearchOpen}
        isHomeActive={isHomeActive}
        onSearchClick={event => {
          searchOriginRef.current = event.currentTarget;
          setIsSearchOpen(true);
        }}
      />
      <CartSummary
        cart={cart}
        request={app?.cartSummaryRequest ?? cartRevision}
      />
      <MenuSearch
        isOpen={isSearchOpen}
        onClose={closeSearch}
      />
    </div>
  );
}
