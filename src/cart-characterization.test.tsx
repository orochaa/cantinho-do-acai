import { CartProvider, useCart } from '@/context/cart-provider';
import { ToastProvider } from '@/context/toast-provider';
import { CartPage } from '@/pages/cart';
import { act } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { afterEach, describe, expect, it, vi } from 'vitest';

const navigateMock = vi.hoisted(() => vi.fn());

vi.mock('react-router', async importOriginal => {
  const actual = await importOriginal<typeof import('react-router')>();

  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

const product: Product = {
  description: 'Produto de caracterização',
  fullPrice: 12,
  img: '/img/test-product.png',
  name: 'Produto de teste',
  people: 1,
  price: 10,
  slang: 'produto-de-teste',
};

const createItem = (
  overrides: Partial<{
    count: number;
    observation: string;
    options: Array<Option>;
  }> = {},
) => ({
  count: 1,
  observation: 'Sem gelo',
  options: [
    { name: 'Complemento incluído', count: 2 },
    { name: 'Extra pago', count: 1, price: 3 },
    { name: 'Opção zerada', count: 0, price: 99 },
    { name: 'Opção grátis', count: 1, price: 0 },
    { name: 'Opção negativa', count: 1, price: -2 },
  ],
  product,
  ...overrides,
});

let activeRoot: Root | undefined;

afterEach(() => {
  activeRoot?.unmount();
  activeRoot = undefined;
  document.body.innerHTML = '';
  navigateMock.mockReset();
  vi.restoreAllMocks();
});

function renderCartProbe(): ReturnType<typeof useCart> {
  let currentContext: ReturnType<typeof useCart> | undefined;

  function Probe(): null {
    currentContext = useCart();
    return null;
  }

  const container = document.createElement('div');
  document.body.append(container);
  activeRoot = createRoot(container);
  act(() => {
    activeRoot?.render(
      <CartProvider>
        <Probe />
      </CartProvider>,
    );
  });

  if (!currentContext) {
    throw new Error('Cart context was not rendered');
  }

  return {
    get cart() {
      return currentContext?.cart ?? [];
    },
    addCartEvent: event => currentContext?.addCartEvent(event),
  };
}

function findButton(label: string): HTMLButtonElement {
  const button = Array.from(document.querySelectorAll('button')).find(
    candidate => candidate.textContent?.includes(label),
  );

  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Button not found: ${label}`);
  }

  return button;
}

function findExactButton(label: string): HTMLButtonElement {
  const button = Array.from(document.querySelectorAll('button')).find(
    candidate => candidate.textContent?.trim() === label,
  );

  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Button not found: ${label}`);
  }

  return button;
}

function setInputValue(input: HTMLInputElement, value: string): void {
  const valueSetter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;

  valueSetter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

function renderCheckout(): void {
  function Fixture(): React.JSX.Element {
    const { addCartEvent } = useCart();

    return (
      <>
        <CartPage />
        <button
          type="button"
          onClick={() =>
            addCartEvent({
              type: 'add',
              item: createItem(),
            })
          }>
          Preparar fixture
        </button>
      </>
    );
  }

  const container = document.createElement('div');
  document.body.append(container);
  activeRoot = createRoot(container);
  act(() => {
    activeRoot?.render(
      <HelmetProvider>
        <ToastProvider>
          <CartProvider>
            <Fixture />
          </CartProvider>
        </ToastProvider>
      </HelmetProvider>,
    );
  });

  act(() => findButton('Preparar fixture').click());
}

describe('CartProvider characterization', () => {
  it('should add items with current option pricing and omit zero-count options', () => {
    const context = renderCartProbe();

    act(() => {
      context.addCartEvent({ type: 'add', item: createItem() });
    });

    const [item] = context.cart;
    expect(item.total).toBe(11);
    expect(item.options.map(option => option.name)).toEqual([
      'Complemento incluído',
      'Extra pago',
      'Opção grátis',
      'Opção negativa',
    ]);
    expect(item.options[0]?.count).toBe(2);
    expect(item.options[1]?.price).toBe(3);
  });

  it('should update quantity totals and remove the selected item', () => {
    const context = renderCartProbe();

    act(() => {
      context.addCartEvent({
        type: 'add',
        item: createItem({ observation: 'Primeiro' }),
      });
      context.addCartEvent({
        type: 'add',
        item: createItem({ observation: 'Segundo', count: 2 }),
      });
    });

    act(() => {
      context.addCartEvent({ type: 'update-quantity', index: 0, count: 3 });
    });

    expect(context.cart[0]?.count).toBe(3);
    expect(context.cart[0]?.total).toBe(33);

    act(() => {
      context.addCartEvent({ type: 'remove', index: 0 });
    });

    expect(context.cart).toHaveLength(1);
    expect(context.cart[0]?.observation).toBe('Segundo');
  });

  it('should preserve zero-price options and apply negative-price options', () => {
    const context = renderCartProbe();

    act(() => {
      context.addCartEvent({
        type: 'add',
        item: createItem({
          options: [
            { name: 'Grátis', count: 1, price: 0 },
            { name: 'Negativa', count: 1, price: -4 },
          ],
        }),
      });
    });

    expect(context.cart[0]?.total).toBe(6);
    expect(context.cart[0]?.options).toHaveLength(2);
  });
});

describe('CartPage checkout characterization', () => {
  it('should reject checkout without a name and insufficient cash', () => {
    renderCheckout();

    act(() => findButton('Confirmar Pedido').click());
    expect(document.body.textContent).toContain('informe o seu nome');

    const name = document.querySelector<HTMLInputElement>('#client-name');
    if (!name) {
      throw new Error('Client name input not found');
    }

    act(() => {
      setInputValue(name, 'Maria');
    });

    act(() => findButton('Dinheiro').click());
    const cash = document.querySelector<HTMLInputElement>('#cash-value');
    if (!cash) {
      throw new Error('Cash input not found');
    }

    act(() => {
      setInputValue(cash, 'R$ 5,00');
    });
    act(() => findButton('Confirmar Pedido').click());

    expect(document.body.textContent).toContain(
      'valor em dinheiro igual ou superior ao total',
    );
    expect(document.body.textContent).not.toContain('ATENÇÃO');

    act(() => setInputValue(cash, 'R$ 20,00'));
    expect(document.body.textContent).toContain('Troco: R$\u00a09,00');
  });

  it('should generate the current WhatsApp message for a valid pickup order', () => {
    renderCheckout();

    const name = document.querySelector<HTMLInputElement>('#client-name');
    if (!name) {
      throw new Error('Client name input not found');
    }

    act(() => {
      setInputValue(name, 'Maria');
    });
    act(() => findButton('Confirmar Pedido').click());
    expect(document.body.textContent).toContain('ATENÇÃO');

    const openMock = vi.spyOn(window, 'open').mockImplementation(() => null);
    act(() => findExactButton('Continuar').click());

    const [url] = openMock.mock.calls[0] ?? [];
    const message = decodeURI(String(url)).split('text=')[1] ?? '';
    expect(message).toContain('Produto de teste');
    expect(message).toContain('Complemento incluído');
    expect(message).toContain('Extra pago');
    expect(message).toContain('Sem gelo');
    expect(message).toContain('Retirada no local');
    expect(message).toContain('*Forma de Pagamento:* PIX');
    expect(message).toContain('Nome: Maria');
    expect(message).toContain('*Total:* R$\u00a011,00');
  });
});
