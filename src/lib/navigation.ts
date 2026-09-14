import { type CartItem, isValidCartItem } from '@/domain/cart';
import { visibleMenu } from '@/domain/menu';

export interface CartEditIntent {
  type: 'edit-cart-intent';
  item: CartItem;
}

export interface QuickAddIntent {
  type: 'quick-add-intent';
  productSlang: string;
}

export const isCartEditIntent = (value: unknown): value is CartEditIntent =>
  typeof value === 'object' &&
  value !== null &&
  (value as { type?: unknown }).type === 'edit-cart-intent' &&
  isValidCartItem((value as { item?: unknown }).item);

export const isQuickAddIntent = (value: unknown): value is QuickAddIntent =>
  typeof value === 'object' &&
  value !== null &&
  (value as { type?: unknown }).type === 'quick-add-intent' &&
  typeof (value as { productSlang?: unknown }).productSlang === 'string';

export const getProductPath = (product: Product): string => {
  const entry = visibleMenu.find(item =>
    item.products.some(
      candidate =>
        candidate.slang === product.slang || candidate.name === product.name,
    ),
  );
  const matchedProduct = entry?.products.find(
    candidate =>
      candidate.slang === product.slang || candidate.name === product.name,
  );
  const slug = matchedProduct?.slang ?? product.slang;
  return entry?.category.quickAdd
    ? `/${entry.route}`
    : `/${entry?.route}/${slug}`;
};

export const navigateToElement = (elementId: string): void => {
  const element = document.querySelector(`#${elementId}`);

  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};
