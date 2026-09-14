import { QuickAddDialog } from '@/components/quick-add-dialog';
import { CartProvider } from '@/context/cart-provider';
import { ToastProvider } from '@/context/toast-provider';
import { act } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
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
  vi.restoreAllMocks();
});

describe(QuickAddDialog.name, () => {
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
