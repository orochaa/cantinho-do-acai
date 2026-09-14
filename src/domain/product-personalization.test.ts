import {
  createPersonalizedOrderItem,
  createProductPersonalizationState,
  getPersonalizationTotal,
  type PersonalizationMultipleGroup,
  type PersonalizationSingleGroup,
  productPersonalizationReducer,
  type SelectableOption,
  validateProductPersonalization,
} from '@/domain/product-personalization';

const product: Product = {
  img: '/product.png',
  name: 'Produto',
  description: '',
  slang: 'produto',
  fullPrice: 10,
  price: 10,
  people: 1,
};

describe('product personalization', () => {
  it('should select one named single option and clear the other choices', () => {
    const groups: { type: PersonalizationSingleGroup } = {
      type: {
        type: 'single',
        options: [{ name: 'A', isSelected: true }, { name: 'B' }],
      },
    };
    const state = createProductPersonalizationState(groups);
    const result = productPersonalizationReducer<typeof groups>(state, {
      type: 'select',
      group: 'type',
      option: { name: 'B', isSelected: false, count: 0 },
    });

    expect(result.groups.type).toMatchObject({
      isSelected: true,
      options: [
        { name: 'A', count: 0, isSelected: false },
        { name: 'B', count: 1, isSelected: true },
      ],
    });
  });

  it('should validate a required single option until it is selected', () => {
    const groups: { sauce: PersonalizationSingleGroup } = {
      sauce: {
        type: 'single',
        options: [{ name: 'Maionese' }, { name: 'Ketchup' }],
        required: 'Favor escolher molho',
      },
    };
    const state = createProductPersonalizationState(groups);

    expect(validateProductPersonalization(state)).toBe('Favor escolher molho');

    const selected = productPersonalizationReducer(state, {
      type: 'select',
      group: 'sauce',
      option: { name: 'Ketchup', isSelected: false, count: 0 },
    });

    expect(validateProductPersonalization(selected)).toBeUndefined();
  });

  it('should enforce a named multiple option count limit', () => {
    const state = createProductPersonalizationState({
      complements: {
        type: 'multiple',
        options: [{ name: 'A' }, { name: 'B' }],
        countLimit: 1,
      },
    });
    const selected = productPersonalizationReducer(state, {
      type: 'add',
      group: 'complements',
      option: { name: 'A', count: 0 },
    });
    const blocked = productPersonalizationReducer(selected, {
      type: 'add',
      group: 'complements',
      option: { name: 'B', count: 0 },
    });

    expect(blocked).toEqual(selected);
  });

  it('should preserve discriminated multiple option names', () => {
    const groups: {
      flavors: PersonalizationMultipleGroup<'A' | 'B'>;
    } = {
      flavors: {
        type: 'multiple',
        options: [{ name: 'A' }, { name: 'B' }],
        countLimit: 2,
      },
    };

    const state = createProductPersonalizationState(groups);
    const optionName: 'A' | 'B' = state.groups.flavors.options[0].name;

    expect(optionName).toBe('A');
  });

  it('should preserve discriminated single option names', () => {
    const groups: {
      type: PersonalizationSingleGroup<'A' | 'B'>;
    } = {
      type: {
        type: 'single',
        options: [{ name: 'A' }, { name: 'B' }],
      },
    };

    const state = createProductPersonalizationState(groups);
    const optionName: 'A' | 'B' = state.groups.type.options[0].name;
    const option: SelectableOption<'A' | 'B'> = {
      name: 'B',
      isSelected: false,
      count: 0,
    };
    const selected = productPersonalizationReducer(state, {
      type: 'select',
      group: 'type',
      option,
    });

    expect(optionName).toBe('A');
    expect(selected.groups.type.options).toEqual([
      { name: 'A', isSelected: false, count: 0 },
      { name: 'B', isSelected: true, count: 1 },
    ]);
  });

  it('should enforce the limit for repeated events with a stale option count', () => {
    const groups = {
      complements: {
        type: 'multiple' as const,
        options: [{ name: 'Banana' }],
        countLimit: 7,
      },
    };
    const state = createProductPersonalizationState(groups);
    const event = {
      type: 'add' as const,
      group: 'complements' as const,
      option: { name: 'Banana', count: 0 },
    };

    let result = state;

    for (let i = 0; i < 8; i += 1) {
      result = productPersonalizationReducer(result, event);
    }

    expect(result.groups.complements).toMatchObject({
      countTotal: 7,
      options: [{ name: 'Banana', count: 7 }],
    });
  });

  it('should preserve initial multiple option counts', () => {
    const state = createProductPersonalizationState({
      extras: {
        type: 'multiple',
        options: [{ name: 'A', count: 2 }, { name: 'B' }],
        countLimit: 3,
        required: 'Favor escolher extras',
      },
    });

    expect(state.groups.extras).toMatchObject({
      countTotal: 2,
      options: [
        { name: 'A', count: 2 },
        { name: 'B', count: 0 },
      ],
    });
    expect(validateProductPersonalization(state)).toBeUndefined();
  });

  it('should remove one multiple option without changing other groups', () => {
    const groups: {
      extras: PersonalizationMultipleGroup;
      toppings: PersonalizationMultipleGroup;
    } = {
      extras: {
        type: 'multiple',
        options: [{ name: 'Granola', count: 2 }, { name: 'Paçoca' }],
        countLimit: 3,
      },
      toppings: {
        type: 'multiple',
        options: [{ name: 'Banana', count: 1 }],
        countLimit: 2,
      },
    };
    const state = createProductPersonalizationState(groups);
    const result = productPersonalizationReducer(state, {
      type: 'remove',
      group: 'extras',
      option: { name: 'Granola', count: 2 },
    });

    expect(result.groups.extras).toMatchObject({
      countTotal: 1,
    });
    expect(result.groups.extras.options).toContainEqual({
      name: 'Granola',
      count: 1,
    });
    expect(result.groups.toppings).toMatchObject({
      countTotal: 1,
      options: [{ name: 'Banana', count: 1 }],
    });
  });

  it('should ignore removing a multiple option that is not selected', () => {
    const state = createProductPersonalizationState({
      extras: {
        type: 'multiple',
        options: [{ name: 'Granola' }],
        countLimit: 2,
      },
    });

    const result = productPersonalizationReducer(state, {
      type: 'remove',
      group: 'extras',
      option: { name: 'Granola', count: 0 },
    });

    expect(result).toBe(state);
  });

  it('should ignore removing an unknown multiple option', () => {
    const state = createProductPersonalizationState({
      extras: {
        type: 'multiple',
        options: [{ name: 'Granola' }],
        countLimit: 2,
      },
    });

    const result = productPersonalizationReducer(state, {
      type: 'remove',
      group: 'extras',
      option: { name: 'Paçoca', count: 1 },
    });

    expect(result).toBe(state);
  });

  it('should calculate option pricing and omit zero-count options', () => {
    const state = createProductPersonalizationState({
      extras: {
        type: 'multiple',
        options: [
          { name: 'Pago', price: 3 },
          { name: 'Grátis', price: 0 },
        ],
        countLimit: 2,
      },
    });
    const selected = productPersonalizationReducer(state, {
      type: 'add',
      group: 'extras',
      option: { name: 'Pago', count: 0, price: 3 },
    });

    expect(getPersonalizationTotal(selected, product)).toBe(13);
    expect(createPersonalizedOrderItem(selected, product, 1).options).toEqual([
      { name: 'Pago', price: 3, count: 1 },
    ]);
  });

  it('should create a priced order item with its observation', () => {
    const state = createProductPersonalizationState({
      size: {
        type: 'single',
        options: [{ name: 'Grande', price: 25, isSelected: true }],
      },
    });

    const item = createPersonalizedOrderItem(
      state,
      { ...product, price: 0 },
      2,
      'Sem canudo',
    );

    expect(item).toMatchObject({
      count: 2,
      observation: 'Sem canudo',
      options: [{ name: 'Grande', price: 25, count: 1 }],
      total: 50,
    });
  });

  it('should validate a required named group before adding a product', () => {
    const state = createProductPersonalizationState({
      flavors: {
        type: 'multiple',
        options: [{ name: 'A' }],
        countLimit: 2,
        required: 'Favor escolher sabores',
      },
    });

    expect(validateProductPersonalization(state)).toBe(
      'Favor escolher sabores',
    );
  });
});
