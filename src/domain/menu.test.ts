import { bebidaCategory } from '@/domain/categories/bebida';
import { paletaCategory } from '@/domain/categories/paleta';
import { getMenuEntry, getProduct, menu, visibleMenu } from '@/domain/menu';

describe('menu registry', () => {
  it('should expose route metadata for every category', () => {
    expect(menu).toHaveLength(8);
    expect(menu.map(entry => entry.path)).toEqual([
      'acai/:slang',
      'premium/:slang',
      'felicidade/:slang',
      'paleta/:slang',
      'geladinho/:slang',
      'pastel/:slang',
      'salgados/:slang',
      'bebidas/:slang',
    ]);
  });

  it('should hide disabled categories and products from the visible menu', () => {
    expect(visibleMenu.every(entry => !entry.category.disabled)).toBe(true);
    expect(
      visibleMenu.every(entry => entry.category.description.trim().length > 0),
    ).toBe(true);

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

  it('should expose first-class quick-add products for paletas and bebidas', () => {
    expect(paletaCategory.products.map(product => product.name)).toContain(
      'Paleta de Ninho com Nutella',
    );
    expect(bebidaCategory.products.map(product => product.name)).toContain(
      'Sprite 600ml',
    );
    expect(paletaCategory.quickAdd).toBe(true);
    expect(bebidaCategory.quickAdd).toBe(true);
  });
});
