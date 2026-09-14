import { Input } from '@/components/input';
import type { CartCheckoutState } from '@/hooks/use-cart-checkout';

export function CartIdentification(
  props: Pick<
    CartCheckoutState,
    'clientName' | 'setClientName' | 'validationErrors'
  >,
): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <label
          htmlFor="client-name"
          className="ml-1 leading-3 font-bold">
          Seu nome:
        </label>
        <Input
          id="client-name"
          type="text"
          placeholder="Digite o seu nome"
          value={props.clientName}
          aria-required="true"
          aria-invalid={!!props.validationErrors?.clientName}
          aria-describedby="client-name-help client-name-error"
          onChange={event => props.setClientName(event.target.value)}
        />
        <p
          id="client-name-help"
          className="ml-1 text-xs text-zinc-600">
          Para que possamos identificar o seu pedido.
        </p>
        {!!props.validationErrors?.clientName && (
          <p
            id="client-name-error"
            role="alert"
            className="text-red-500">
            {props.validationErrors.clientName}
          </p>
        )}
      </div>
    </div>
  );
}
