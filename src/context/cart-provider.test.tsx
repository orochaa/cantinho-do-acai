import { CartProvider, useCart } from '@/context/cart-provider';
import { act } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

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
    get cartRevision() {
      return currentContext?.cartRevision ?? 0;
    },
  };
}

describe(CartProvider.name, () => {
  it('should assign stable ids and use them for item mutations', () => {
    const context = renderCartProbe();

    act(() => {
      context.addCartEvent({
        type: 'add',
        item: createItem({ observation: 'Primeiro' }),
      });
      context.addCartEvent({
        type: 'add',
        item: createItem({ observation: 'Segundo' }),
      });
    });

    const firstId = context.cart[0]?.id;
    const secondId = context.cart[1]?.id;
    expect(firstId).toEqual(expect.any(String));
    expect(secondId).toEqual(expect.any(String));
    expect(firstId).not.toBe(secondId);

    act(() => {
      if (!secondId) {
        throw new Error('Second cart item has no id');
      }
      context.addCartEvent({ type: 'update-quantity', id: secondId, count: 4 });
      if (!firstId) {
        throw new Error('First cart item has no id');
      }
      context.addCartEvent({ type: 'remove', id: firstId });
    });

    expect(context.cart).toHaveLength(1);
    expect(context.cart[0]?.id).toBe(secondId);
    expect(context.cart[0]?.count).toBe(4);
  });

  it('should restore a persisted cart after the provider is remounted', () => {
    const firstContext = renderCartProbe();

    act(() => {
      firstContext.addCartEvent({ type: 'add', item: createItem() });
    });
    const savedId = firstContext.cart[0]?.id;
    activeRoot?.unmount();
    activeRoot = undefined;

    const restoredContext = renderCartProbe();

    expect(restoredContext.cart).toHaveLength(1);
    expect(restoredContext.cart[0]?.id).toBe(savedId);
    expect(restoredContext.cart[0]?.total).toBe(11);
  });

  it('should discard malformed and outdated persisted carts', () => {
    window.localStorage.setItem('cantinho-do-acai-cart', '{malformed');
    expect(renderCartProbe().cart).toEqual([]);
    expect(window.localStorage.getItem('cantinho-do-acai-cart')).toBe(
      JSON.stringify({ version: 2, value: { cart: [] } }),
    );

    activeRoot?.unmount();
    activeRoot = undefined;
    window.localStorage.setItem(
      'cantinho-do-acai-cart',
      JSON.stringify([{ id: 'old-item' }]),
    );

    expect(renderCartProbe().cart).toEqual([]);
    expect(window.localStorage.getItem('cantinho-do-acai-cart')).toBe(
      JSON.stringify({ version: 2, value: { cart: [] } }),
    );
  });

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
