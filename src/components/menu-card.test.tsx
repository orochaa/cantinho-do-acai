import { MenuCard } from '@/components/menu-card';
import { getLocalWeekday, resolveProduct } from '@/domain/highlights';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

let activeRoot: Root | undefined;

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeRoot = undefined;
  document.body.innerHTML = '';
});

describe(MenuCard.name, () => {
  it('should render a product whose active promotion is already resolved', () => {
    const product: Product = {
      description: 'Produto de teste',
      fullPrice: 20,
      highlights: [
        {
          type: 'weekly-promo',
          weekday: getLocalWeekday(new Date()),
          price: 15,
        },
      ],
      img: '/img/test.png',
      name: 'Produto de teste',
      people: 1,
      price: 20,
      slang: 'produto-de-teste',
    };
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    expect(() =>
      act(() =>
        activeRoot?.render(
          <MemoryRouter>
            <MenuCard product={resolveProduct(product)} />
          </MemoryRouter>,
        ),
      ),
    ).not.toThrow();
  });
});
