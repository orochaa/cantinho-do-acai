import { createOrderItem } from '@/domain/order';
import { CartItems } from '@/pages/cart/components/cart-items';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

const product: Product = {
  description: '',
  fullPrice: 15,
  img: '/img/pastel.avif',
  name: 'Pastel de Frango',
  people: 1,
  price: 15,
  slang: 'pastel-de-frango',
};

let activeRoot: Root | undefined;

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeRoot = undefined;
  document.body.innerHTML = '';
});

describe(CartItems.name, () => {
  it('should show the final price for a size adjustment', () => {
    const item = {
      ...createOrderItem({
        product,
        options: [
          {
            name: 'Pastel Pequeno',
            count: 1,
            price: -10,
            priceMode: 'adjustment',
          },
        ],
        count: 1,
      }),
      id: 'pastel-item',
    };
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <CartItems
          cart={[item]}
          onEdit={vi.fn()}
          onRemove={vi.fn()}
        />,
      );
    });

    expect(container.textContent).toContain('Pastel Pequeno - R$ 5,00');
    expect(container.textContent).toContain('R$ 5,00');
  });

  it('should keep ordinary negative option prices as adjustments', () => {
    const item = {
      ...createOrderItem({
        product,
        options: [{ name: 'Discount', count: 1, price: -10 }],
        count: 1,
      }),
      id: 'discount-item',
    };
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <CartItems
          cart={[item]}
          onEdit={vi.fn()}
          onRemove={vi.fn()}
        />,
      );
    });

    expect(container.textContent).toContain('Discount - -R$ 10,00');
  });
});
