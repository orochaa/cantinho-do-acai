import type { CartItem, CartPersistence } from '@/domain/cart';
import { createCartReducer, hydrateCart } from '@/domain/cart';
import { describe, expect, it, vi } from 'vitest';

const product: Product = {
  description: 'Test product',
  fullPrice: 12,
  img: '/img/test-product.png',
  name: 'Test product',
  people: 1,
  price: 10,
  slang: 'test-product',
};

const item = {
  product,
  options: [{ name: 'Extra', count: 1, price: 2 }],
  count: 1,
};

describe(createCartReducer.name, () => {
  it('should add a normalized item with the generated id and total', () => {
    const reducer = createCartReducer(() => 'first-id');
    const result = reducer([], {
      type: 'add',
      item: {
        ...item,
        options: [
          ...item.options,
          { name: 'Empty option', count: 0, price: 100 },
        ],
      },
    });

    expect(result).toEqual([
      {
        ...item,
        id: 'first-id',
        total: 12,
      },
    ]);
    expect(result[0]?.options).toEqual(item.options);
  });

  it('should update quantity by id and preserve the item id', () => {
    const reducer = createCartReducer(() => 'stable-id');
    const initial = reducer([], { type: 'add', item });
    const result = reducer(initial, {
      type: 'update-quantity',
      id: 'stable-id',
      count: 3,
    });

    expect(result).toEqual([{ ...item, id: 'stable-id', count: 3, total: 36 }]);
    expect(result).not.toBe(initial);
    expect(initial[0]?.count).toBe(1);
  });

  it('should update quantity by index', () => {
    const reducer = createCartReducer(() => 'stable-id');
    const initial = reducer([], { type: 'add', item });

    expect(
      reducer(initial, { type: 'update-quantity', index: 0, count: 2 })[0],
    ).toMatchObject({
      id: 'stable-id',
      count: 2,
      total: 24,
    });
  });

  it('should replace an item by id while preserving id and deriving total', () => {
    const reducer = createCartReducer(() => 'stable-id');
    const initial = reducer([], { type: 'add', item });
    const result = reducer(initial, {
      type: 'replace',
      id: 'stable-id',
      item: {
        ...item,
        count: 3,
        options: [{ name: 'New extra', count: 1, price: 4 }],
      },
    });

    expect(result).toEqual([
      {
        ...item,
        id: 'stable-id',
        count: 3,
        options: [{ name: 'New extra', count: 1, price: 4 }],
        total: 42,
      },
    ]);
    expect(result).not.toBe(initial);
  });

  it.each([
    { type: 'replace', id: 'missing-id', item },
    { type: 'replace', item },
  ] as const)('should ignore replacement without a matching id', event => {
    const reducer = createCartReducer(() => 'stable-id');
    const initial = reducer([], { type: 'add', item });
    expect(reducer(initial, event)).toBe(initial);
  });

  it.each([
    { type: 'update-quantity', id: 'stable-id', count: 0 },
    { type: 'update-quantity', id: 'stable-id', count: -1 },
    { type: 'update-quantity', id: 'stable-id', count: 1.5 },
    { type: 'update-quantity', id: 'missing-id', count: 2 },
    { type: 'update-quantity', index: 3, count: 2 },
  ] as const)('should ignore invalid or missing quantity updates', event => {
    const reducer = createCartReducer(() => 'stable-id');
    const initial = reducer([], { type: 'add', item });

    expect(reducer(initial, event)).toBe(initial);
  });

  it('should remove an item by id or index without mutating other items', () => {
    let nextId = 0;
    const reducer = createCartReducer(() => `id-${nextId++}`);
    const initial = reducer(reducer([], { type: 'add', item }), {
      type: 'add',
      item: { ...item, count: 2 },
    });

    const afterIdRemoval = reducer(initial, { type: 'remove', id: 'id-0' });
    expect(afterIdRemoval).toEqual([
      { ...item, count: 2, id: 'id-1', total: 24 },
    ]);
    expect(reducer(afterIdRemoval, { type: 'remove', index: 0 })).toEqual([]);
    expect(reducer(initial, { type: 'remove', id: 'missing-id' })).toBe(
      initial,
    );
    expect(reducer(initial, { type: 'remove', index: 4 })).toBe(initial);
  });

  it('should keep independently added duplicate items addressable by id', () => {
    let nextId = 0;
    const reducer = createCartReducer(() => `duplicate-${nextId++}`);
    const initial = reducer(reducer([], { type: 'add', item }), {
      type: 'add',
      item,
    });

    expect(initial).toHaveLength(2);
    expect(initial[0]?.id).not.toBe(initial[1]?.id);

    const updated = reducer(initial, {
      type: 'update-quantity',
      id: initial[1]?.id,
      count: 4,
    });

    expect(updated[0]?.count).toBe(1);
    expect(updated[1]).toMatchObject({ count: 4, total: 48 });
    expect(reducer(updated, { type: 'remove', id: initial[0]?.id })).toEqual([
      { ...item, id: 'duplicate-1', count: 4, total: 48 },
    ]);
  });
});

describe(hydrateCart.name, () => {
  it('should clear malformed persisted state', () => {
    const persistence: CartPersistence = {
      load: () => ({ version: 1, cart: [{ invalid: true }] }),
      save: vi.fn(),
      clear: vi.fn(),
    };

    expect(hydrateCart(persistence, 1)).toEqual([]);
    expect(persistence.clear).toHaveBeenCalledOnce();
  });

  it('should restore valid persisted state', () => {
    const persisted: CartItem = { ...item, id: 'saved-id', total: 12 };
    const persistence: CartPersistence = {
      load: () => ({ version: 1, cart: [persisted] }),
      save: vi.fn(),
      clear: vi.fn(),
    };

    expect(hydrateCart(persistence, 1)).toEqual([persisted]);
    expect(persistence.clear).not.toHaveBeenCalled();
  });
});
