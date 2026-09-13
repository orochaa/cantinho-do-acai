import { acaiCategory } from '@/lib/data/acai';
import { bebidaCategory } from '@/lib/data/bebida';
import { felicidadeCategory } from '@/lib/data/felicidade';
import { geladinhoCategory } from '@/lib/data/geladinho';
import { paletaCategory } from '@/lib/data/paleta';
import { pastelCategory } from '@/lib/data/pastel';
import { premiumCategory } from '@/lib/data/premium';
import { salgadosCategory } from '@/lib/data/salgados';

export interface MenuEntry<TProduct extends Product = Product> {
  readonly name: string;
  readonly category: Category<TProduct>;
  readonly route: string;
  readonly path: string;
}

const createEntry = <TProduct extends Product>(
  name: string,
  category: Category<TProduct>,
): MenuEntry<TProduct> => ({
  name,
  category,
  route: category.slang,
  path: `${category.slang}/:slang`,
});

export const menu = [
  createEntry('Pastéis', pastelCategory),
  createEntry('Açaí', acaiCategory),
  createEntry('Premium', premiumCategory),
  createEntry('Paletas', paletaCategory),
  createEntry('Copos da Felicidade', felicidadeCategory),
  createEntry('Geladinho Gourmet', geladinhoCategory),
  createEntry('Salgados', salgadosCategory),
  createEntry('Bebidas', bebidaCategory),
] as const;

export const visibleMenu = menu
  .filter(entry => !entry.category.disabled)
  .map(entry => ({
    ...entry,
    products: entry.category.products.filter(product => !product.disabled),
  }));

export function getMenuEntry(route: string): MenuEntry | undefined {
  return menu.find(entry => entry.route === route);
}

export function getProduct(
  route: string,
  productRoute: string,
): Product | undefined {
  const entry = getMenuEntry(route);
  if (!entry || entry.category.disabled) {
    return undefined;
  }
  return entry.category.products.find(
    product => product.slang === productRoute && !product.disabled,
  );
}
