import type { OrderItem } from '@/lib/order';
import type {
  PersonalizationGroups,
  ProductPersonalizationEvent,
  ProductPersonalizationState,
} from '@/lib/product-personalization';
import {
  createPersonalizedOrderItem,
  createProductPersonalizationState,
  getPersonalizationTotal,
  productPersonalizationReducer,
  validateProductPersonalization,
} from '@/lib/product-personalization';
import { useCallback, useReducer } from 'react';

export function useProductPersonalization<Groups extends PersonalizationGroups>(
  product: Product,
  groups: Groups,
): ProductPersonalizationState<Groups> & {
  dispatch: (event: ProductPersonalizationEvent<Groups>) => void;
  total: number;
  validate: () => string | undefined;
  createOrderItem: (count: number, observation?: string) => OrderItem;
} {
  const [state, dispatch] = useReducer(
    productPersonalizationReducer,
    groups,
    createProductPersonalizationState,
  );
  const dispatchEvent = useCallback(
    (event: ProductPersonalizationEvent<Groups>): void => {
      dispatch(event as never);
    },
    [],
  );

  const validate = useCallback(
    () => validateProductPersonalization(state),
    [state],
  );
  const createItem = useCallback(
    (count: number, observation?: string) =>
      createPersonalizedOrderItem(state, product, count, observation),
    [product, state],
  );

  return {
    ...state,
    dispatch: dispatchEvent,
    total: getPersonalizationTotal(state, product),
    validate,
    createOrderItem: createItem,
  } as ProductPersonalizationState<Groups> & {
    dispatch: (event: ProductPersonalizationEvent<Groups>) => void;
    total: number;
    validate: () => string | undefined;
    createOrderItem: (count: number, observation?: string) => OrderItem;
  };
}
