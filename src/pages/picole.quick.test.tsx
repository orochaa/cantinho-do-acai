import { CartProvider, useCart } from '@/context/cart-provider';
import { ToastProvider } from '@/context/toast-provider';
import { picoleCategory } from '@/domain/categories/picole';
import { PicoleQuickForm } from '@/pages/picole.quick';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const product = picoleCategory.products.find(
  candidate => candidate.slang === 'picole-de-fruta',
);

if (!product) {
  throw new Error('Picolé de Fruta was not registered.');
}

function CartProbe(): React.JSX.Element {
  const { cart } = useCart();
  return (
    <output data-testid="cart-probe">
      {cart
        .map(
          item =>
            `${item.product.name}:${item.total}:${item.options
              .map(option => `${option.name}:${option.count}`)
              .join(',')}`,
        )
        .join('|')}
    </output>
  );
}

let activeRoot: Root | undefined;

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    },
  });
});

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeRoot = undefined;
  document.body.innerHTML = '';
});

describe(PicoleQuickForm.name, () => {
  it('should charge each repeated Picolé selection and hide product quantity', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <CartProbe />
            <PicoleQuickForm
              open
              product={product}
              onClose={() => {}}
              observationPlaceholder="Exemplo"
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Adicionar Abacaxi"]',
        )
        ?.click(),
    );
    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Adicionar Abacaxi"]',
        )
        ?.click(),
    );
    act(() => {
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.trim() === 'Continuar')
        ?.click();
    });

    expect(
      document.querySelector('button[aria-label="Aumentar quantidade"]'),
    ).toBeNull();
    expect(document.body.textContent).toContain('R$ 11,00');

    act(() => {
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click();
    });

    expect(
      document.querySelector('[data-testid="cart-probe"]')?.textContent,
    ).toBe('Picolé de Fruta:11:Abacaxi:2,Desconto do preço do pote:1');
  });
});
