import {
  calendarDate,
  getActiveHighlight,
  localDate,
  resolveProduct,
} from '@/domain/highlights';

const product: Product = {
  img: '/product.jpg',
  name: 'Produto de teste',
  description: 'Descrição',
  slang: 'produto-de-teste',
  fullPrice: 20,
  price: 10,
  people: 1,
};

describe('highlight resolution', () => {
  it('should use start-inclusive and end-exclusive scheduled promo dates', () => {
    const highlighted = {
      ...product,
      highlights: [
        {
          type: 'scheduled-promo' as const,
          start: localDate('2026-01-10'),
          end: localDate('2026-01-20'),
          price: 8,
        },
      ],
    };

    expect(
      getActiveHighlight(highlighted, new Date('2026-01-10T12:00:00Z')),
    ).not.toBeNull();
    expect(
      getActiveHighlight(highlighted, new Date('2026-01-20T12:00:00Z')),
    ).toBeNull();
  });

  it('should skip expired entries and use the first active entry', () => {
    const highlighted = {
      ...product,
      highlights: [
        {
          type: 'scheduled-promo' as const,
          start: calendarDate(2026, 1, 1),
          end: calendarDate(2026, 2, 1),
          price: 8,
        },
        {
          type: 'product-release' as const,
          start: calendarDate(2026, 2, 1),
          end: calendarDate(2026, 3, 1),
        },
      ],
    };

    expect(
      getActiveHighlight(highlighted, new Date('2026-02-15T12:00:00Z'))
        ?.highlight.type,
    ).toBe('product-release');
  });

  it('should switch release-promo to regular release pricing after promo end', () => {
    const highlighted = {
      ...product,
      highlights: [
        {
          type: 'release-promo' as const,
          start: calendarDate(2026, 1, 1),
          end: calendarDate(2026, 1, 10),
          price: 7,
        },
      ],
    };

    expect(
      resolveProduct(highlighted, new Date('2026-01-05T12:00:00Z')).price,
    ).toBe(7);
    expect(
      resolveProduct(highlighted, new Date('2026-01-15T12:00:00Z')).price,
    ).toBe(10);
    expect(
      getActiveHighlight(highlighted, new Date('2026-02-01T12:00:00Z')),
    ).toBeNull();
  });

  it('should reject a promo price that is not below the current price', () => {
    const highlighted = {
      ...product,
      highlights: [
        {
          type: 'scheduled-promo' as const,
          start: calendarDate(2026, 1, 1),
          end: calendarDate(2026, 2, 1),
          price: 10,
        },
      ],
    };

    expect(() =>
      getActiveHighlight(highlighted, new Date('2026-01-10T12:00:00Z')),
    ).toThrow();
  });

  it('should apply a weekly promo on the selected local weekday', () => {
    const highlighted = {
      ...product,
      highlights: [
        {
          type: 'weekly-promo' as const,
          weekday: 'monday' as const,
          price: 8,
        },
      ],
    };

    expect(
      resolveProduct(highlighted, new Date('2026-01-05T12:00:00Z')).price,
    ).toBe(8);
    expect(
      getActiveHighlight(highlighted, new Date('2026-01-06T12:00:00Z')),
    ).toBeNull();
  });

  it('should resolve weekly promo weekday using the local calendar day', () => {
    const highlighted = {
      ...product,
      highlights: [
        {
          type: 'weekly-promo' as const,
          weekday: 'monday' as const,
          price: 8,
        },
      ],
    };

    expect(
      getActiveHighlight(highlighted, new Date('2026-01-04T20:59:59Z')),
    ).toBeNull();
    expect(
      getActiveHighlight(highlighted, new Date('2026-01-04T21:00:00Z')),
    ).not.toBeNull();
  });

  it('should keep the first active weekly promo when entries overlap', () => {
    const highlighted = {
      ...product,
      highlights: [
        {
          type: 'weekly-promo' as const,
          weekday: 'monday' as const,
          price: 8,
        },
        {
          type: 'weekly-promo' as const,
          weekday: 'monday' as const,
          price: 7,
        },
      ],
    };

    expect(
      resolveProduct(highlighted, new Date('2026-01-05T12:00:00Z')).price,
    ).toBe(8);
  });
});
