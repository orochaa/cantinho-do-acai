import { isCartEditIntent } from '@/lib/navigation';
import { describe, expect, it } from 'vitest';

const product: Product = {
  description: 'Produto de teste',
  fullPrice: 12,
  img: '/img/test.png',
  name: 'Produto de teste',
  people: 1,
  price: 10,
  slang: 'produto-de-teste',
};

describe(isCartEditIntent.name, () => {
  it('should reject malformed navigation state', () => {
    expect(isCartEditIntent({ type: 'edit-cart-intent', item: {} })).toBe(
      false,
    );
    expect(isCartEditIntent({ type: 'edit-cart-intent', item: null })).toBe(
      false,
    );
  });

  it('should accept a valid cart edit intent', () => {
    expect(
      isCartEditIntent({
        type: 'edit-cart-intent',
        item: {
          id: 'saved-item',
          product,
          options: [],
          count: 1,
          total: 10,
        },
      }),
    ).toBe(true);
  });
});
