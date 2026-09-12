import { Container } from '@/components/container';
import type { CartCheckoutState } from '@/hooks/use-cart-checkout';

export function CartDeliveryAddress(
  props: Pick<
    CartCheckoutState,
    | 'address'
    | 'addressComplement'
    | 'addressError'
    | 'addressNumber'
    | 'addressReference'
    | 'cep'
    | 'cepLoading'
    | 'handleCepChange'
    | 'setAddressComplement'
    | 'setAddressNumber'
    | 'setAddressReference'
    | 'validationErrors'
  >,
): React.JSX.Element {
  return (
    <Container>
      <h2 className="ml-1 text-xl font-bold text-white">Endereço de entrega</h2>
      <div className="flex flex-col gap-2 rounded-sm bg-zinc-100 px-2 py-4">
        <div className="flex items-center justify-between">
          <label
            htmlFor="cep"
            className="ml-1 leading-3 font-bold">
            CEP:
          </label>
          <a
            href="https://buscacepinter.correios.com.br/app/endereco/index.php"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-blue-500 hover:underline">
            Não sabe seu CEP?
          </a>
        </div>
        <input
          id="cep"
          type="text"
          inputMode="numeric"
          placeholder="Digite o CEP do seu endereço"
          className="w-full rounded-sm border border-zinc-300 p-2 shadow-sm"
          value={props.cep}
          aria-invalid={!!(props.addressError || props.validationErrors?.cep)}
          aria-describedby={
            props.addressError || props.validationErrors?.cep
              ? 'cep-error'
              : undefined
          }
          aria-required="true"
          onChange={async event => {
            await props.handleCepChange(event.target.value);
          }}
          maxLength={9}
        />
        {props.cepLoading ? (
          <p
            id="cep-status"
            role="status"
            aria-live="polite">
            Buscando CEP...
          </p>
        ) : props.addressError ? (
          <p
            id="cep-error"
            className="text-red-500"
            role="alert">
            {props.addressError ?? props.validationErrors?.cep}
          </p>
        ) : props.address ? (
          <div className="flex flex-col gap-1">
            <p>
              <strong>Rua:</strong> {props.address.street}
            </p>
            <p>
              <strong>Bairro:</strong> {props.address.neighborhood}
            </p>
            <p>
              <strong>Cidade:</strong> {props.address.city}
            </p>
            <p>
              <strong>Estado:</strong> {props.address.state}
            </p>
            <label
              htmlFor="address-number"
              className="mt-2 ml-1 leading-3 font-bold">
              Número:
            </label>
            <input
              id="address-number"
              type="text"
              inputMode="numeric"
              placeholder="Digite o número do seu endereço"
              className="w-full rounded-sm border border-zinc-300 p-2 shadow-sm"
              value={props.addressNumber}
              aria-required="true"
              aria-invalid={!!props.validationErrors?.addressNumber}
              aria-describedby="address-number-error"
              onChange={event => props.setAddressNumber(event.target.value)}
            />
            {!!props.validationErrors?.addressNumber && (
              <p
                id="address-number-error"
                role="alert"
                className="text-red-500">
                {props.validationErrors.addressNumber}
              </p>
            )}
            <label
              htmlFor="address-complement"
              className="mt-2 ml-1 leading-3 font-bold">
              Complemento (opcional):
            </label>
            <input
              id="address-complement"
              type="text"
              placeholder="Ex: Apartamento 101, Bloco A"
              className="w-full rounded-sm border border-zinc-300 p-2 shadow-sm"
              value={props.addressComplement}
              onChange={event => props.setAddressComplement(event.target.value)}
            />
            <label
              htmlFor="address-reference"
              className="mt-2 ml-1 leading-3 font-bold">
              Ponto de referência (opcional):
            </label>
            <input
              id="address-reference"
              type="text"
              placeholder="Ex: Próximo à padaria"
              className="w-full rounded-sm border border-zinc-300 p-2 shadow-sm"
              value={props.addressReference}
              onChange={event => props.setAddressReference(event.target.value)}
            />
          </div>
        ) : null}
      </div>
    </Container>
  );
}
