import { CartProvider, useCart } from '@/context/cart-provider';
import { ToastProvider } from '@/context/toast-provider';
import { CartPage } from '@/pages/cart/cart';
import { act } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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

const createItem = () => ({
  count: 1,
  observation: 'Sem gelo',
  options: [
    { name: 'Complemento incluído', count: 2 },
    { name: 'Extra pago', count: 1, price: 3 },
    { name: 'Opção grátis', count: 1, price: 0 },
    { name: 'Opção negativa', count: 1, price: -2 },
  ],
  product,
});

let activeRoot: Root | undefined;

const storage = new Map<string, string>();
const localStorageMock: Storage = {
  get length() {
    return storage.size;
  },
  clear: () => storage.clear(),
  getItem: key => storage.get(key) ?? null,
  key: index => Array.from(storage.keys())[index] ?? null,
  removeItem: key => storage.delete(key),
  setItem: (key, value) => storage.set(key, value),
};

beforeEach(() => {
  Object.defineProperty(window, 'localStorage', {
    configurable: true,
    value: localStorageMock,
  });
});

afterEach(() => {
  activeRoot?.unmount();
  activeRoot = undefined;
  document.body.innerHTML = '';
  window.localStorage.clear();
  navigateMock.mockReset();
  vi.restoreAllMocks();
});

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

function renderEmptyCart(): void {
  const container = document.createElement('div');
  document.body.append(container);
  activeRoot = createRoot(container);
  act(() => {
    activeRoot?.render(
      <HelmetProvider>
        <ToastProvider>
          <CartProvider>
            <CartPage />
          </CartProvider>
        </ToastProvider>
      </HelmetProvider>,
    );
  });
}

describe(CartPage.name, () => {
  it('should render an empty cart without redirecting away', () => {
    renderEmptyCart();

    expect(document.body.textContent).toContain('Seu carrinho está vazio');
    expect(navigateMock).not.toHaveBeenCalled();
  });

  it('should open the matching product when editing a cart item', () => {
    renderCheckout();

    act(() =>
      document
        .querySelector<HTMLButtonElement>('button[aria-label^="Editar"]')
        ?.click(),
    );

    expect(navigateMock).toHaveBeenCalledWith(
      expect.stringContaining('produto-de-teste'),
      expect.objectContaining({
        state: expect.objectContaining({ type: 'edit-cart-intent' }),
      }),
    );
  });

  it('should show a CEP lookup error when the request fails', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockRejectedValue(new Error('Network error')),
    );
    renderCheckout();

    act(() => findButton('Entrega (com taxa de entrega)').click());
    const cepInput = document.querySelector<HTMLInputElement>('#cep');
    if (!cepInput) {
      throw new Error('CEP input not found');
    }

    await act(async () => {
      setInputValue(cepInput, '95000-000');
      await Promise.resolve();
    });

    expect(cepInput.value).toBe('95000000');
    expect(document.body.textContent).toContain('CEP não encontrado.');
  });

  it('should ignore a stale CEP response after the input changes', async () => {
    let resolveFirst: ((response: Response) => void) | undefined;
    let resolveSecond: ((response: Response) => void) | undefined;
    const fetchMock = vi.fn((url: string) => {
      const response = new Promise<Response>(resolve => {
        if (url.endsWith('95000000')) {
          resolveFirst = resolve;
        } else {
          resolveSecond = resolve;
        }
      });

      return response;
    });
    vi.stubGlobal('fetch', fetchMock);
    renderCheckout();

    act(() => findButton('Entrega (com taxa de entrega)').click());
    const cepInput = document.querySelector<HTMLInputElement>('#cep');
    if (!cepInput) {
      throw new Error('CEP input not found');
    }

    act(() => setInputValue(cepInput, '95000000'));
    act(() => setInputValue(cepInput, '95100000'));
    expect(document.body.textContent).toContain('Buscando CEP...');

    await act(async () => {
      resolveSecond?.(
        new Response(
          JSON.stringify({
            cep: '95100000',
            state: 'RS',
            city: 'Flores da Cunha',
            neighborhood: 'Centro',
            street: 'Rua Nova',
            service: 'correios',
          }),
          { status: 200 },
        ),
      );
      await Promise.resolve();
    });

    expect(document.body.textContent).toContain('Rua Nova');
    expect(document.body.textContent).toContain('Flores da Cunha');

    await act(async () => {
      resolveFirst?.(
        new Response(
          JSON.stringify({
            cep: '95000000',
            state: 'RS',
            city: 'Caxias do Sul',
            neighborhood: 'Centro',
            street: 'Rua Antiga',
            service: 'correios',
          }),
          { status: 200 },
        ),
      );
      await Promise.resolve();
    });

    expect(document.body.textContent).toContain('Rua Nova');
    expect(document.body.textContent).not.toContain('Rua Antiga');
  });

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
    const message = decodeURIComponent(String(url)).split('text=')[1] ?? '';
    expect(message).toContain('Produto de teste');
    expect(message).toContain('Complemento incluído');
    expect(message).toContain('Extra pago');
    expect(message).toContain('Sem gelo');
    expect(message).toContain('Retirada no local');
    expect(message).toContain('*Forma de Pagamento:* PIX');
    expect(message).toContain('Nome: Maria');
    expect(message).toContain('*Total:* R$\u00a011,00');
    expect(openMock).toHaveBeenCalledWith(
      expect.any(String),
      '_blank',
      'noopener,noreferrer',
    );
  });
});
