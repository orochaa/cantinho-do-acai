import type { OrderItem } from '@/domain/order';
import {
  createPersonalizedOrderItem,
  getPersonalizationTotal,
  hydrateProductPersonalizationState,
  type PersonalizationGroups,
  type ProductPersonalizationEvent,
  type ProductPersonalizationState,
  productPersonalizationReducer,
  validateProductPersonalization,
} from '@/domain/product-personalization';
import { useCallback, useEffect, useReducer, useRef } from 'react';

type ProductPersonalizationAction<Groups extends PersonalizationGroups> =
  | ProductPersonalizationEvent<Groups>
  | {
      type: 'reset';
      groups: Groups;
      initialItem?: Pick<OrderItem, 'options'>;
    };

export function useProductPersonalization<Groups extends PersonalizationGroups>(
  product: Product,
  groups: Groups,
  initialItem?: Pick<OrderItem, 'options'>,
): ProductPersonalizationState<Groups> & {
  dispatch: (event: ProductPersonalizationEvent<Groups>) => void;
  total: number;
  validate: () => string | undefined;
  createOrderItem: (count: number, observation?: string) => OrderItem;
} {
  const latestInput = useRef({ groups, initialItem });
  latestInput.current = { groups, initialItem };
  const previousProduct = useRef(product);
  const [state, dispatch] = useReducer(
    (
      currentState: ProductPersonalizationState<Groups>,
      event: ProductPersonalizationAction<Groups>,
    ): ProductPersonalizationState<Groups> =>
      event.type === 'reset'
        ? hydrateProductPersonalizationState(event.groups, event.initialItem)
        : productPersonalizationReducer(currentState, event),
    { groups, initialItem },
    value =>
      hydrateProductPersonalizationState(value.groups, value.initialItem),
  );

  useEffect(() => {
    if (previousProduct.current === product) {
      return;
    }
    previousProduct.current = product;
    dispatch({
      type: 'reset',
      groups: latestInput.current.groups,
      initialItem: latestInput.current.initialItem,
    });
  }, [product]);

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
