/** biome-ignore-all lint/style/useNamingConvention: TODO */
import type { FulfillmentMethod, PaymentMethod } from '@/domain/order';

export type CheckoutSpoonOption = 'Não, obrigado' | 'Sim, por favor';

export const CheckoutFulfillmentEnum = {
  Delivery: 'Entrega (com taxa de entrega)',
  Pickup: 'Retirada no local',
} as const;

export const CheckoutPaymentEnum = {
  Cash: 'Dinheiro',
  CreditCard: 'Cartão de Crédito',
  Pix: 'PIX',
} as const;

export const CheckoutCutleryEnum = {
  No: 'Não, obrigado',
  Yes: 'Sim, por favor',
} as const;

export interface CheckoutOption<TName extends string> {
  name: TName;
  isSelected: boolean;
  price?: number;
  img?: string;
}

export interface CheckoutOptionGroup<TName extends string> {
  options: Array<CheckoutOption<TName>>;
  isSelected: boolean;
}

export interface CheckoutOptionsState {
  groups: {
    fulfillment: CheckoutOptionGroup<FulfillmentMethod>;
    payment: CheckoutOptionGroup<PaymentMethod>;
    cutlery: CheckoutOptionGroup<CheckoutSpoonOption>;
  };
}

export type CheckoutOptionsEvent =
  | {
      type: 'select';
      group: 'fulfillment';
      option: CheckoutOption<FulfillmentMethod>;
    }
  | { type: 'select'; group: 'payment'; option: CheckoutOption<PaymentMethod> }
  | {
      type: 'select';
      group: 'cutlery';
      option: CheckoutOption<CheckoutSpoonOption>;
    };

const createOptionGroup = <TName extends string>(
  options: Array<{ name: TName; isSelected?: boolean }>,
): CheckoutOptionGroup<TName> => {
  const normalizedOptions = options.map(option => ({
    ...option,
    isSelected: !!option.isSelected,
  }));

  return {
    options: normalizedOptions,
    isSelected: normalizedOptions.some(option => option.isSelected),
  };
};

export const createCheckoutOptionsState = (initial?: {
  fulfillment?: FulfillmentMethod;
  paymentMethod?: PaymentMethod;
  cutlery?: CheckoutSpoonOption;
}): CheckoutOptionsState => ({
  groups: {
    fulfillment: createOptionGroup([
      {
        name: CheckoutFulfillmentEnum.Pickup,
        isSelected:
          initial?.fulfillment === CheckoutFulfillmentEnum.Pickup ||
          initial?.fulfillment === undefined,
      },
      {
        name: CheckoutFulfillmentEnum.Delivery,
        isSelected: initial?.fulfillment === CheckoutFulfillmentEnum.Delivery,
      },
    ]),
    payment: createOptionGroup([
      {
        name: CheckoutPaymentEnum.Pix,
        isSelected:
          initial?.paymentMethod === CheckoutPaymentEnum.Pix ||
          initial?.paymentMethod === undefined,
      },
      {
        name: CheckoutPaymentEnum.CreditCard,
        isSelected: initial?.paymentMethod === CheckoutPaymentEnum.CreditCard,
      },
      {
        name: CheckoutPaymentEnum.Cash,
        isSelected: initial?.paymentMethod === CheckoutPaymentEnum.Cash,
      },
    ]),
    cutlery: createOptionGroup([
      {
        name: CheckoutCutleryEnum.No,
        isSelected:
          initial?.cutlery === CheckoutCutleryEnum.No ||
          initial?.cutlery === undefined,
      },
      {
        name: CheckoutCutleryEnum.Yes,
        isSelected: initial?.cutlery === CheckoutCutleryEnum.Yes,
      },
    ]),
  },
});

const selectOption = <TName extends string>(
  group: CheckoutOptionGroup<TName>,
  selectedOption: CheckoutOption<TName>,
): CheckoutOptionGroup<TName> => {
  const isKnownOption = group.options.some(
    option => option.name === selectedOption.name,
  );

  return {
    isSelected: isKnownOption,
    options: group.options.map(option => ({
      ...option,
      isSelected: isKnownOption && option.name === selectedOption.name,
    })),
  };
};

export const checkoutOptionsReducer = (
  state: CheckoutOptionsState,
  event: CheckoutOptionsEvent,
): CheckoutOptionsState => ({
  groups: {
    ...state.groups,
    [event.group]: selectOption(state.groups[event.group], event.option),
  },
});
