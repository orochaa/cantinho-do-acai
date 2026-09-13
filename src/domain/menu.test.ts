import { getMenuEntry, getProduct, menu, visibleMenu } from '@/domain/menu';

describe('menu registry', () => {
  it('should expose route metadata for every category', () => {
    expect(menu).toHaveLength(8);
    expect(menu.map(entry => entry.path)).toEqual([
      'pastel/:slang',
      'acai/:slang',
      'premium/:slang',
      'paleta/:slang',
      'felicidade/:slang',
      'geladinho/:slang',
      'salgados/:slang',
      'bebidas/:slang',
    ]);
  });

  it('should hide disabled categories and products from the visible menu', () => {
    expect(visibleMenu.every(entry => !entry.category.disabled)).toBe(true);

    const premium = visibleMenu.find(entry => entry.route === 'premium');
    expect(
      premium?.products.some(product => product.name === 'Fini Fest'),
    ).toBe(false);
  });

  it('should look up only enabled categories and products by route', () => {
    expect(getMenuEntry('acai')?.name).toBe('Açaí');
    expect(getProduct('acai', 'copo-de-acai-grande')?.name).toBe(
      'Copo de Açaí Grande',
    );
    expect(getProduct('premium', 'fini-fest')).toBeUndefined();
    expect(getProduct('unknown', 'anything')).toBeUndefined();
  });
});
