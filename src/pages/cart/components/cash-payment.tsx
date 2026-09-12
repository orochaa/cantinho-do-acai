import { Container } from '@/components/container';
import type { CartCheckoutState } from '@/hooks/use-cart-checkout';
import { formatCurrency, parseCurrency } from '@/lib/format';

export function CashPayment(
  props: Pick<
    CartCheckoutState,
    'cashValue' | 'change' | 'orderTotal' | 'setCashValue'
  >,
): React.JSX.Element {
  const amounts = [
    Math.max(props.orderTotal - parseCurrency(props.cashValue), 0),
    20,
    50,
  ];

  return (
    <Container>
      <h2 className="ml-1 text-xl font-bold text-white">
        Pagamento em dinheiro
      </h2>
      <div className="flex flex-col gap-2 rounded-sm bg-zinc-100 px-2 py-4">
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
              className="rounded border border-zinc-300 bg-zinc-200 px-2 py-1.5"
              onClick={() =>
                props.setCashValue(
                  formatCurrency(parseCurrency(props.cashValue) + amount),
                )
              }>
              +{formatCurrency(amount)}
            </button>
          ))}
        </div>
        <input
          id="cash-value"
          type="text"
          inputMode="numeric"
          placeholder="Digite outro valor que você irá pagar em dinheiro"
          className="w-full rounded-sm border border-zinc-300 p-2 shadow-sm"
          value={props.cashValue}
          onChange={event => props.setCashValue(event.target.value)}
        />
        <p className="text-sm text-zinc-600">
          Informe o valor que você irá pagar em dinheiro, para que possamos
          providenciar o troco.
        </p>
        <p className="text-sm text-zinc-600">
          <span className="font-semibold">Troco:</span>{' '}
          {formatCurrency(props.change)}
        </p>
      </div>
    </Container>
  );
}
