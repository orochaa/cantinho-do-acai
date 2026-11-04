import { CartProvider, useCart } from '@/context/cart-provider';
import { ToastProvider } from '@/context/toast-provider';
import { sorveteCategory } from '@/domain/categories/sorvete';
import { SorveteQuickForm } from '@/pages/sorvete.quick';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

const product = sorveteCategory.products.find(
  candidate => candidate.slang === 'pote-de-sorvete-2-litros',
);

if (!product) {
  throw new Error('Pote de Sorvete 2 Litros was not registered.');
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

const clickButton = (selector: string): void => {
  act(() => document.querySelector<HTMLButtonElement>(selector)?.click());
};

const clickContinue = (): void => {
  act(() => {
    Array.from(document.querySelectorAll('button'))
      .find(button => button.textContent?.trim() === 'Continuar')
      ?.click();
  });
};

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

describe(SorveteQuickForm.name, () => {
  it('should charge the full price for each selected Pote flavor', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <CartProbe />
            <SorveteQuickForm
              open
              product={product}
              onClose={() => {}}
              observationPlaceholder="Exemplo"
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    expect(
      document.querySelector('button[aria-label="Aumentar quantidade"]'),
    ).toBeNull();

    clickButton('button[aria-label="Adicionar Sorvete Napolitano"]');
    clickButton('button[aria-label="Adicionar Abacaxi"]');
    clickContinue();

    expect(document.body.textContent).toContain('R$ 79,80');
    expect(
      document.querySelector('button[aria-label="Aumentar quantidade"]'),
    ).toBeNull();

    act(() => {
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click();
    });

    expect(
      document.querySelector('[data-testid="cart-probe"]')?.textContent,
    ).toBe(
      'Pote de Sorvete 2 Litros:79.8:Sorvete Napolitano:1,Abacaxi:1,Desconto do preço do pote:1',
    );
  });

  it('should require a Marmita flavor and allow skipping its sauce', () => {
    const marmita = sorveteCategory.products.find(
      candidate => candidate.slang === 'marmita-de-sorvete',
    );
    if (!marmita) {
      throw new Error('Marmita de Sorvete was not registered.');
    }

    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <CartProbe />
            <SorveteQuickForm
              open
              product={marmita}
              onClose={() => {}}
              observationPlaceholder="Exemplo"
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    clickContinue();
    clickContinue();
    act(() => {
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click();
    });

    expect(document.querySelector('[role="alert"]')?.textContent).toBe(
      'Escolha pelo menos um sabor.',
    );
    expect(document.querySelector('img[alt="Sorvete de Morango"]')).toBeNull();

    clickButton('button[aria-label="Selecionar Sorvete de Morango"]');
    clickContinue();
    clickContinue();
    act(() => {
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click();
    });

    expect(
      document.querySelector('[data-testid="cart-probe"]')?.textContent,
    ).toBe('Marmita de Sorvete:35:Sorvete de Morango:1');
  });
});
