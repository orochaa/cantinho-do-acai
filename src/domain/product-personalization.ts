import type {
  InitialSelectableOption,
  SelectableOption,
} from '@/domain/options';
import type { OrderItem } from '@/domain/order';
import { createOrderItem } from '@/domain/order';

export interface PersonalizationSingleGroup {
  type: 'single';
  options: Array<InitialSelectableOption<string>>;
  required?: string;
}

export interface PersonalizationMultipleGroup<TName extends string = string> {
  type: 'multiple';
  options: Array<Optional<Option<TName>, 'count'>>;
  countLimit: number;
  required?: string;
}

export type PersonalizationGroup =
  | PersonalizationSingleGroup
  | PersonalizationMultipleGroup;

export type PersonalizationGroups = object;

export interface PersonalizationSingleGroupState {
  type: 'single';
  options: Array<SelectableOption<string>>;
  isSelected: boolean;
  required?: string;
}

export interface PersonalizationMultipleGroupState<
  TName extends string = string,
> {
  type: 'multiple';
  options: Array<Option<TName>>;
  countLimit: number;
  countTotal: number;
  required?: string;
}

export type MultipleOptionsState<TName extends string = string> =
  PersonalizationMultipleGroupState<TName>;

export interface MultipleOptionsEvent<TName extends string = string> {
  type: 'add' | 'remove';
  option: Option<TName>;
}

export type PersonalizationGroupState =
  | PersonalizationSingleGroupState
  | PersonalizationMultipleGroupState;

type PersonalizationGroupStateFor<Group> = Group extends {
  type: 'single';
}
  ? PersonalizationSingleGroupState
  : Group extends PersonalizationMultipleGroup<infer TName>
    ? PersonalizationMultipleGroupState<TName>
    : PersonalizationMultipleGroupState;

export interface ProductPersonalizationState<
  Groups extends PersonalizationGroups = PersonalizationGroups,
> {
  groups: {
    [K in keyof Groups]: PersonalizationGroupStateFor<Groups[K]>;
  };
}

export type ProductPersonalizationEvent<
  TGroups extends PersonalizationGroups = PersonalizationGroups,
> = {
  [K in keyof TGroups]: TGroups[K] extends { type: 'single' }
    ? { type: 'select'; group: K; option: SelectableOption<string> }
    : TGroups[K] extends PersonalizationMultipleGroup<infer TName>
      ? { type: 'add' | 'remove'; group: K; option: Option<TName> }
      : { type: 'add' | 'remove'; group: K; option: Option };
}[keyof TGroups];

export const createProductPersonalizationState = <
  TGroups extends PersonalizationGroups,
>(
  groups: TGroups,
): ProductPersonalizationState<TGroups> => ({
  groups: Object.fromEntries(
    Object.entries(groups).map(([name, value]) => {
      const group = value as PersonalizationGroup;

      return [
        name,
        group.type === 'single'
          ? {
              ...group,
              isSelected: group.options.some(option => option.isSelected),
              options: group.options.map(option => ({
                ...option,
                isSelected: !!option.isSelected,
                count: option.isSelected ? 1 : 0,
              })),
            }
          : (() => {
              const options = group.options.map(option => ({
                count: 0,
                ...option,
              }));

              return {
                ...group,
                countTotal: options.reduce(
                  (total, option) => total + option.count,
                  0,
                ),
                options,
              };
            })(),
      ];
    }),
  ) as ProductPersonalizationState<TGroups>['groups'],
});

type PersonalizationStateEntries<Groups extends PersonalizationGroups> = Array<
  [keyof Groups, PersonalizationGroupState]
>;

const getStateEntries = <Groups extends PersonalizationGroups>(
  state: ProductPersonalizationState<Groups>,
): PersonalizationStateEntries<Groups> =>
  Object.entries(state.groups) as PersonalizationStateEntries<Groups>;

export const selectPersonalizationOption = <
  Groups extends PersonalizationGroups,
>(
  state: ProductPersonalizationState<Groups>,
  event: Extract<ProductPersonalizationEvent<Groups>, { type: 'select' }>,
): ProductPersonalizationState<Groups> => ({
  groups: Object.fromEntries(
    getStateEntries(state).map(([name, currentGroup]) => [
      name,
      name === event.group && currentGroup.type === 'single'
        ? {
            ...currentGroup,
            isSelected: true,
            options: currentGroup.options.map(option => ({
              ...option,
              isSelected: option.name === event.option.name,
              count: option.name === event.option.name ? 1 : 0,
            })),
          }
        : currentGroup,
    ]),
  ) as ProductPersonalizationState<Groups>['groups'],
});

export const addPersonalizationOption = <Groups extends PersonalizationGroups>(
  state: ProductPersonalizationState<Groups>,
  event: Extract<ProductPersonalizationEvent<Groups>, { type: 'add' }>,
): ProductPersonalizationState<Groups> => {
  const group = state.groups[event.group];

  if (group?.type !== 'multiple') {
    return state;
  }

  const currentOption = group.options.find(
    option => option.name === event.option.name,
  );

  if (!currentOption || group.countTotal >= group.countLimit) {
    return state;
  }

  const countTotal = group.countTotal + 1;

  return {
    groups: Object.fromEntries(
      getStateEntries(state).map(([name, currentGroup]) => [
        name,
        name === event.group && currentGroup.type === 'multiple'
          ? {
              ...currentGroup,
              countTotal,
              options: currentGroup.options.map(option =>
                option.name === event.option.name
                  ? { ...option, count: option.count + 1 }
                  : option,
              ),
            }
          : currentGroup,
      ]),
    ) as ProductPersonalizationState<Groups>['groups'],
  };
};

export const removePersonalizationOption = <
  Groups extends PersonalizationGroups,
>(
  state: ProductPersonalizationState<Groups>,
  event: Extract<ProductPersonalizationEvent<Groups>, { type: 'remove' }>,
): ProductPersonalizationState<Groups> => {
  const group = state.groups[event.group];

  const currentOption = group?.options.find(
    option => option.name === event.option.name,
  );

  if (group?.type !== 'multiple' || !currentOption?.count) {
    return state;
  }

  return {
    groups: Object.fromEntries(
      getStateEntries(state).map(([name, currentGroup]) => [
        name,
        name === event.group && currentGroup.type === 'multiple'
          ? {
              ...currentGroup,
              countTotal: currentGroup.countTotal - 1,
              options: currentGroup.options.map(option =>
                option.name === event.option.name
                  ? { ...option, count: currentOption.count - 1 }
                  : option,
              ),
            }
          : currentGroup,
      ]),
    ) as ProductPersonalizationState<Groups>['groups'],
  };
};

export const productPersonalizationReducer = <
  Groups extends PersonalizationGroups,
>(
  state: ProductPersonalizationState<Groups>,
  event: ProductPersonalizationEvent<Groups>,
): ProductPersonalizationState<Groups> => {
  if (event.type === 'select') {
    return selectPersonalizationOption(
      state,
      event as Extract<ProductPersonalizationEvent<Groups>, { type: 'select' }>,
    );
  }
  if (event.type === 'add') {
    return addPersonalizationOption(
      state,
      event as Extract<ProductPersonalizationEvent<Groups>, { type: 'add' }>,
    );
  }
  return removePersonalizationOption(
    state,
    event as Extract<ProductPersonalizationEvent<Groups>, { type: 'remove' }>,
  );
};

export const getPersonalizationOptions = <
  TGroups extends PersonalizationGroups,
>(
  state: ProductPersonalizationState<TGroups>,
): Array<Option> =>
  (Object.values(state.groups) as Array<PersonalizationGroupState>).flatMap(
    group => group.options,
  );

export const getPersonalizationTotal = <TGroups extends PersonalizationGroups>(
  state: ProductPersonalizationState<TGroups>,
  product: Product,
): number =>
  product.price +
  getPersonalizationOptions(state).reduce(
    (total, option) => total + (option.price ?? 0) * option.count,
    0,
  );

export const validateProductPersonalization = <
  TGroups extends PersonalizationGroups,
>(
  state: ProductPersonalizationState<TGroups>,
): string | undefined => {
  for (const group of Object.values(
    state.groups,
  ) as Array<PersonalizationGroupState>) {
    if (
      group.required &&
      !(group.type === 'single' ? group.isSelected : group.countTotal > 0)
    ) {
      return group.required;
    }
  }
  return undefined;
};

export const createPersonalizedOrderItem = <
  TGroups extends PersonalizationGroups,
>(
  state: ProductPersonalizationState<TGroups>,
  product: Product,
  count: number,
  observation?: string,
): OrderItem =>
  createOrderItem({
    product,
    options: getPersonalizationOptions(state),
    count,
    observation,
  });
