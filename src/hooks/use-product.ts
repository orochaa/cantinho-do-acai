import { getResolvedProducts } from '@/domain/menu';
import { useMemo } from 'react';
import { useParams } from 'react-router';

export function useProduct<TProduct extends Product>(
  category: Category<TProduct>,
): TProduct {
  const { slang } = useParams();

  return useMemo<TProduct>(() => {
    const catalogProducts = getResolvedProducts(category);
    const enabledProducts = catalogProducts.filter(
      product => !product.disabled,
    );
    const products =
      enabledProducts.length > 0 ? enabledProducts : catalogProducts;
    const defaultProduct = products[0];

    if (!slang) {
      return defaultProduct;
    }
    const product = products.find(p => p.slang === slang);

    if (!product) {
      return defaultProduct;
    }

    return product;
  }, [category, slang]);
}
