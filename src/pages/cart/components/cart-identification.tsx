import { Container } from '@/components/container';
import type { CartCheckoutState } from '@/hooks/use-cart-checkout';

export function CartIdentification(
  props: Pick<CartCheckoutState, 'clientName' | 'setClientName'>,
): React.JSX.Element {
  return (
    <Container>
      <h2 className="ml-1 text-xl font-bold text-white">
        Identificação do pedido
      </h2>
      <div className="flex flex-col gap-2 rounded-sm bg-zinc-100 px-2 py-4">
        <label
          htmlFor="client-name"
          className="ml-1 leading-3 font-bold">
          Seu nome:
        </label>
        <input
          id="client-name"
          type="text"
          placeholder="Digite o seu nome"
          className="w-full rounded-sm border border-zinc-300 p-2 shadow-sm"
          value={props.clientName}
          onChange={event => props.setClientName(event.target.value)}
        />
        <p className="ml-1 text-xs text-zinc-600">
          Para que possamos identificar o seu pedido.
        </p>
      </div>
    </Container>
  );
}
