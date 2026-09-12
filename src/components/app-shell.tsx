import { CartProvider } from '@/context/cart-provider';
import { ToastProvider } from '@/context/toast-provider';
import type { ReactNode } from 'react';
import { HelmetProvider } from 'react-helmet-async';

export interface AppShellProps {
  children: ReactNode;
}

export function AppShell(props: AppShellProps): React.JSX.Element {
  return (
    <HelmetProvider>
      <ToastProvider>
        <CartProvider>{props.children}</CartProvider>
      </ToastProvider>
    </HelmetProvider>
  );
}
