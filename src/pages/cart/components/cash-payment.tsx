import { Input } from '@/components/input';
import { formatCurrency, parseCurrency } from '@/domain/format';
import type { CartCheckoutState } from '@/hooks/use-cart-checkout';

export function CashPayment(
  props: Pick<
    CartCheckoutState,
    'cashValue' | 'change' | 'orderTotal' | 'setCashValue' | 'validationErrors'
  >,
): React.JSX.Element {
  const amounts = [
    Math.max(props.orderTotal - parseCurrency(props.cashValue), 0),
    20,
    50,
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3">
        <label
          htmlFor="cash-value"
          className="ml-1 leading-3 font-bold">
          Valor em dinheiro:
        </label>
        <div className="flex items-center justify-start gap-3">
          {amounts.map(amount => (
            <button
              key={amount}
              type="button"
              className="min-h-11 min-w-11 rounded-lg border border-zinc-200 bg-white px-3 py-1.5 font-semibold text-purple-900 shadow-sm transition hover:border-purple-200 hover:bg-purple-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-100"
              onClick={() =>
                props.setCashValue(
                  formatCurrency(parseCurrency(props.cashValue) + amount),
                )
              }>
              +{formatCurrency(amount)}
            </button>
          ))}
        </div>
        <Input
          id="cash-value"
          type="text"
          inputMode="numeric"
          placeholder="Digite outro valor que você irá pagar em dinheiro"
          value={props.cashValue}
          aria-describedby="cash-value-help cash-value-error"
          aria-invalid={!!props.validationErrors?.cashValue}
          onChange={event => props.setCashValue(event.target.value)}
        />
        <p
          id="cash-value-help"
          className="text-sm text-zinc-600">
          Informe o valor que você irá pagar em dinheiro, para que possamos
          providenciar o troco.
        </p>
        {!!props.validationErrors?.cashValue && (
          <p
            id="cash-value-error"
            role="alert"
            className="text-red-500">
            {props.validationErrors.cashValue}
          </p>
        )}
        <p
          className="text-sm text-zinc-600"
          aria-live="polite">
          <span className="font-semibold">Troco:</span>{' '}
          {formatCurrency(props.change)}
        </p>
      </div>
    </div>
  );
}
