import { QuickAddDialog } from '@/components/quick-add-dialog';
import { CartProvider, useCart } from '@/context/cart-provider';
import { ToastProvider } from '@/context/toast-provider';
import { createOrderItem } from '@/domain/order';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const product: Product = {
  description: 'Produto de teste',
  fullPrice: 12,
  img: '/img/test.png',
  name: 'Produto de teste',
  people: 1,
  price: 10,
  slang: 'produto-de-teste',
};

let activeRoot: Root | undefined;
const storage = new Map<string, string>();

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: {
      clear: () => storage.clear(),
      getItem: (key: string) => storage.get(key) ?? null,
      removeItem: (key: string) => storage.delete(key),
      setItem: (key: string, value: string) => storage.set(key, value),
    },
  });
});

const setTextareaValue = (
  textarea: HTMLTextAreaElement,
  value: string,
): void => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value',
  )?.set;
  setter?.call(textarea, value);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
};

function CartProbe(): React.JSX.Element {
  const { cart } = useCart();
  return (
    <>
      <output data-testid="cart-probe">
        {cart.map(item => `${item.product.name}:${item.total}`).join('|')}
      </output>
      <output data-testid="cart-options">
        {cart
          .map(item =>
            item.options
              .map(option => `${option.name}:${option.count}`)
              .join(','),
          )
          .join('|')}
      </output>
    </>
  );
}

beforeEach(() => {
  HTMLButtonElement.prototype.setPointerCapture = vi.fn();
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
  storage.clear();
  vi.restoreAllMocks();
});

describe(QuickAddDialog.name, () => {
  it('should add a quick product with its selected option and quantity', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <CartProbe />
            <QuickAddDialog
              open
              observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
              product={product}
              onClose={vi.fn()}
              steps={[
                {
                  defaultOptionIndex: 0,
                  description: 'Escolha a intensidade.',
                  id: 'intensity',
                  options: [
                    { name: 'Suave', price: 0 },
                    { name: 'Forte', price: 2 },
                  ],
                  title: 'Intensidade',
                },
              ]}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    act(() => {
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Selecionar Forte"]',
        )
        ?.click();
    });
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent === 'Continuar')
        ?.click(),
    );
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click(),
    );

    expect(
      document.querySelector('[data-testid="cart-probe"]')?.textContent,
    ).toBe('Produto de teste:12');
  });

  it('should hydrate an edited item and invoke its save callback', () => {
    const editItem = {
      ...createOrderItem({
        product,
        options: [{ name: 'Forte', price: 2, count: 1 }],
        count: 2,
        observation: 'Com carinho',
      }),
      id: 'saved-item',
    };
    const onEditSave = vi.fn();
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              editItem={editItem}
              open
              onClose={vi.fn()}
              onEditSave={onEditSave}
              observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
              product={product}
              steps={[
                {
                  defaultOptionIndex: 0,
                  description: 'Escolha a intensidade.',
                  id: 'intensity',
                  options: [
                    { name: 'Suave', price: 0 },
                    { name: 'Forte', price: 2 },
                  ],
                  title: 'Intensidade',
                },
              ]}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    expect(
      document.querySelector<HTMLButtonElement>(
        'button[aria-label="Desselecionar Forte"]',
      ),
    ).not.toBeNull();

    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.trim() === 'Continuar')
        ?.click(),
    );
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click(),
    );

    expect(onEditSave).toHaveBeenCalledOnce();
  });

  it('should render an injected option step', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              open
              observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
              steps={[
                {
                  defaultOptionIndex: 1,
                  description: 'Escolha a intensidade desejada.',
                  id: 'intensity',
                  options: [
                    { name: 'Suave', price: 0 },
                    { name: 'Forte', price: 2 },
                  ],
                  title: 'Qual intensidade você prefere?',
                },
                {
                  defaultOptionIndex: 0,
                  description: 'Escolha o acompanhamento desejado.',
                  id: 'topping',
                  options: [{ name: 'Canela', price: 1 }],
                  title: 'Qual acompanhamento você prefere?',
                },
              ]}
              product={product}
              onClose={vi.fn()}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    expect(document.body.textContent).toContain(
      'Qual intensidade você prefere?',
    );
    expect(document.body.textContent).toContain(
      'Escolha a intensidade desejada.',
    );
    expect(document.body.textContent).toContain('Forte');

    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent === 'Continuar')
        ?.click(),
    );
    expect(document.body.textContent).toContain(
      'Qual acompanhamento você prefere?',
    );
  });

  it('should render adjusted option prices as final prices', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              open
              observationPlaceholder="Exemplo"
              onClose={vi.fn()}
              product={{ ...product, price: 15 }}
              steps={[
                {
                  defaultOptionIndex: 0,
                  description: 'Escolha o tamanho.',
                  id: 'size',
                  options: [
                    {
                      name: 'Pastel Grande',
                      price: 10,
                      priceMode: 'adjustment',
                    },
                  ],
                  title: 'Tamanho',
                },
              ]}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    expect(document.body.textContent).toContain('R$ 25,00');
  });

  it('should require one or more choices for a multi-select step', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <CartProbe />
            <QuickAddDialog
              open
              observationPlaceholder="Exemplo"
              product={product}
              onClose={vi.fn()}
              steps={[
                {
                  description: 'Escolha os sabores.',
                  id: 'flavors',
                  required: 'Escolha pelo menos um sabor.',
                  selection: 'multiple',
                  options: [
                    { name: 'Morango', price: 0 },
                    { name: 'Chocolate', price: 0 },
                  ],
                  title: 'Sabores',
                },
              ]}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    const continueButton = Array.from(document.querySelectorAll('button')).find(
      button => button.textContent?.trim() === 'Continuar',
    );
    expect(continueButton?.disabled).toBe(false);
    expect(document.body.textContent).not.toContain(
      'Escolha pelo menos um sabor.',
    );

    act(() => continueButton?.click());
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click(),
    );
    expect(document.body.textContent).toContain('Escolha pelo menos um sabor.');

    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Adicionar Morango"]',
        )
        ?.click(),
    );
    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Adicionar Chocolate"]',
        )
        ?.click(),
    );
    act(() => continueButton?.click());
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click(),
    );

    expect(
      document.querySelector('[data-testid="cart-options"]')?.textContent,
    ).toBe('Morango:1,Chocolate:1');
  });

  it('should require a selection for a required single-choice step', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              open
              observationPlaceholder="Exemplo"
              product={product}
              onClose={vi.fn()}
              steps={[
                {
                  description: 'Escolha um sabor.',
                  id: 'flavor',
                  selection: 'single',
                  required: 'Escolha um sabor.',
                  options: [{ name: 'Morango', price: 0 }],
                  title: 'Sabor',
                },
              ]}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    const continueButton = Array.from(document.querySelectorAll('button')).find(
      button => button.textContent?.trim() === 'Continuar',
    );
    expect(continueButton?.disabled).toBe(false);
    expect(document.querySelector('[role="alert"]')).toBeNull();

    act(() => continueButton?.click());
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click(),
    );
    expect(document.querySelector('[role="alert"]')?.textContent).toBe(
      'Escolha um sabor.',
    );

    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Selecionar Morango"]',
        )
        ?.click(),
    );
    expect(document.querySelector('[role="alert"]')).toBeNull();
    expect(
      document.querySelector<HTMLButtonElement>(
        'button[aria-label="Selecionado Morango"]',
      )?.disabled,
    ).toBe(true);
  });

  it('should allow adding the same option multiple times', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <CartProbe />
            <QuickAddDialog
              open
              observationPlaceholder="Exemplo"
              product={product}
              onClose={vi.fn()}
              steps={[
                {
                  description: 'Escolha os sabores.',
                  id: 'flavors',
                  discountProductPrice: true,
                  required: 'Escolha pelo menos um sabor.',
                  selection: 'multiple',
                  options: [{ name: 'Morango', price: product.price }],
                  title: 'Sabores',
                },
              ]}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Adicionar Morango"]',
        )
        ?.click(),
    );
    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Adicionar Morango"]',
        )
        ?.click(),
    );
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.trim() === 'Continuar')
        ?.click(),
    );
    expect(
      document.querySelector('button[aria-label="Aumentar quantidade"]'),
    ).toBeNull();
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.includes('Adicionar ao pedido'))
        ?.click(),
    );

    expect(
      document.querySelector('[data-testid="cart-options"]')?.textContent,
    ).toBe('Morango:2,Desconto do preço do pote:1');
    expect(
      document.querySelector('[data-testid="cart-probe"]')?.textContent,
    ).toBe('Produto de teste:20');
  });

  it('should hide the review quantity for a price-discount option group before selection', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              open
              observationPlaceholder="Exemplo"
              product={product}
              onClose={vi.fn()}
              steps={[
                {
                  description: 'Escolha um sabor.',
                  discountProductPrice: true,
                  id: 'flavors',
                  options: [{ name: 'Morango', price: product.price }],
                  required: 'Escolha um sabor.',
                  selection: 'multiple',
                  title: 'Sabores',
                },
              ]}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent?.trim() === 'Continuar')
        ?.click(),
    );

    expect(
      document.querySelector('button[aria-label="Aumentar quantidade"]'),
    ).toBeNull();
  });

  it('should preserve the quick-add draft when viewing product details', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              open
              observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
              product={product}
              onClose={vi.fn()}
              steps={[
                {
                  defaultOptionIndex: 0,
                  description: 'Escolha a intensidade.',
                  id: 'intensity',
                  options: [
                    { name: 'Suave', price: 0 },
                    { name: 'Forte', price: 2 },
                  ],
                  title: 'Intensidade',
                },
              ]}
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    act(() =>
      document
        .querySelector<HTMLButtonElement>(
          'button[aria-label="Selecionar Forte"]',
        )
        ?.click(),
    );
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent === 'Continuar')
        ?.click(),
    );
    act(() =>
      document
        .querySelector<HTMLButtonElement>('button:not([aria-label])')
        ?.click(),
    );

    expect(
      document.querySelector('dialog[aria-labelledby="product-details-title"]'),
    ).not.toBeNull();
    expect(document.body.textContent).toContain('Produto de teste');
    expect(document.body.textContent).toContain('Serve até 1 pessoa');
    expect(document.body.textContent).toContain('R$\u00a010,00');
    expect(
      document.querySelector<HTMLImageElement>(
        'dialog[aria-labelledby="product-details-title"] img',
      )?.src,
    ).toContain('/img/test.png');

    act(() =>
      Array.from(
        document.querySelectorAll<HTMLButtonElement>(
          'dialog[aria-labelledby="product-details-title"] button',
        ),
      )
        .find(button => button.textContent?.trim() === 'Voltar')
        ?.click(),
    );

    expect(document.body.textContent).toContain('Revise seu pedido');
    expect(document.body.textContent).toContain('Forte');
  });

  it('should keep an observation in the final review', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              open
              product={product}
              onClose={vi.fn()}
              observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    const textarea = document.querySelector<HTMLTextAreaElement>(
      '#quick-add-observation',
    );
    if (!textarea) {
      throw new Error('Observation textarea not found');
    }

    act(() => setTextareaValue(textarea, 'Sem gelo'));

    expect(textarea.value).toBe('Sem gelo');
    expect(document.body.textContent).toContain('Revise seu pedido');
  });

  it('should show a nested dialog before discarding a changed draft', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              open
              product={product}
              onClose={vi.fn()}
              observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    const textarea = document.querySelector<HTMLTextAreaElement>(
      '#quick-add-observation',
    );
    if (!textarea) {
      throw new Error('Observation textarea not found');
    }
    act(() => setTextareaValue(textarea, 'Sem gelo'));
    act(() =>
      document
        .querySelector<HTMLButtonElement>('button[aria-label="Fechar"]')
        ?.click(),
    );

    expect(document.body.textContent).toContain('Descartar alterações?');
    expect(document.querySelectorAll('dialog')).toHaveLength(2);
  });

  it('should discard the draft when the nested dialog backdrop is clicked', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <ToastProvider>
          <CartProvider>
            <QuickAddDialog
              open
              product={product}
              onClose={onClose}
              observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
            />
          </CartProvider>
        </ToastProvider>,
      );
    });

    const textarea = document.querySelector<HTMLTextAreaElement>(
      '#quick-add-observation',
    );
    if (!textarea) {
      throw new Error('Observation textarea not found');
    }
    act(() => setTextareaValue(textarea, 'Sem gelo'));
    act(() =>
      document
        .querySelector<HTMLButtonElement>('button[aria-label="Fechar"]')
        ?.click(),
    );

    const discardDialog = Array.from(document.querySelectorAll('dialog')).find(
      dialog =>
        dialog.getAttribute('aria-labelledby') === 'discard-changes-title',
    );
    act(() => discardDialog?.click());
    act(() => vi.advanceTimersByTime(180));

    expect(onClose).toHaveBeenCalledOnce();
    vi.useRealTimers();
  });
});
