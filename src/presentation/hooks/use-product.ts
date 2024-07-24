import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import type { Category, Product } from '../types'

export function useProduct<TProduct extends Product>(
  category: Category<TProduct>
): TProduct {
  const { slang } = useParams()

  return useMemo<TProduct>(() => {
    const defaultProduct = category.products[0]

    if (!slang) {
      return defaultProduct
    }
    const product = category.products.find(p => p.slang === slang)

    if (!product) {
      return defaultProduct
    }

    return product
  }, [category.products, slang])
}
