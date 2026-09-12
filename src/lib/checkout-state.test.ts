import type { CheckoutOptionsEvent } from '@/lib/checkout-state';
import {
  CheckoutCutleryEnum,
  CheckoutFulfillmentEnum,
  CheckoutPaymentEnum,
  checkoutOptionsReducer,
  createCheckoutOptionsState,
} from '@/lib/checkout-state';
import { describe, expect, it } from 'vitest';

describe(checkoutOptionsReducer.name, () => {
  it.each([
    ['fulfillment', CheckoutFulfillmentEnum.Delivery],
    ['payment', CheckoutPaymentEnum.Cash],
    ['cutlery', CheckoutCutleryEnum.Yes],
  ] as const)('should select a %s option', (group, name) => {
    const state = createCheckoutOptionsState();
    const option = state.groups[group].options.find(
      candidate => candidate.name === name,
    );

    if (!option) {
      throw new Error(`Expected ${name} option`);
    }

    const event = {
      type: 'select',
      group,
      option,
    } as CheckoutOptionsEvent;
    const next = checkoutOptionsReducer(state, event);

    expect(next.groups[group].options).toEqual(
      state.groups[group].options.map(candidate => ({
        ...candidate,
        isSelected: candidate.name === name,
      })),
    );
  });

  it('should preserve unrelated named groups', () => {
    const state = createCheckoutOptionsState();
    const option = state.groups.payment.options[2];

    if (!option) {
      throw new Error('Expected payment option');
    }

    const next = checkoutOptionsReducer(state, {
      type: 'select',
      group: 'payment',
      option,
    });

    expect(next).not.toBe(state);
    expect(next.groups.fulfillment).toBe(state.groups.fulfillment);
    expect(next.groups.cutlery).toBe(state.groups.cutlery);
    expect(next.groups.payment).not.toBe(state.groups.payment);
    expect(next.groups.payment.options).not.toBe(state.groups.payment.options);
  });

  it('should clear a group when selecting an unknown option', () => {
    const state = createCheckoutOptionsState();
    const foreignOption = { name: 'Boleto', isSelected: true };

    const next = checkoutOptionsReducer(state, {
      type: 'select',
      group: 'payment',
      option: foreignOption,
    } as CheckoutOptionsEvent);

    expect(next.groups.payment.isSelected).toBe(false);
    expect(
      next.groups.payment.options.every(option => !option.isSelected),
    ).toBe(true);
  });
});
