import { Input } from '@/components/input';
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
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
            className="rounded text-sm text-blue-500 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500">
            Não sabe seu CEP?
          </a>
        </div>
        <Input
          id="cep"
          type="text"
          inputMode="numeric"
          placeholder="Digite o CEP do seu endereço"
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
          <div className="flex flex-col gap-5">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 border-y border-zinc-200 py-4 text-sm">
              <div className="col-span-2">
                <dt className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Rua
                </dt>
                <dd className="mt-1 font-semibold text-zinc-900">
                  {props.address.street}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Bairro
                </dt>
                <dd className="mt-1 font-medium text-zinc-800">
                  {props.address.neighborhood}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Cidade
                </dt>
                <dd className="mt-1 font-medium text-zinc-800">
                  {props.address.city}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-bold tracking-wider text-zinc-500 uppercase">
                  Estado
                </dt>
                <dd className="mt-1 font-medium text-zinc-800">
                  {props.address.state}
                </dd>
              </div>
            </dl>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address-number"
                className="ml-1 leading-3 font-bold">
                Número:
              </label>
              <Input
                id="address-number"
                type="text"
                inputMode="numeric"
                placeholder="Digite o número do seu endereço"
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
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address-complement"
                className="ml-1 leading-3 font-bold">
                Complemento (opcional):
              </label>
              <Input
                id="address-complement"
                type="text"
                placeholder="Exemplo: Apartamento 101, Bloco A"
                value={props.addressComplement}
                onChange={event =>
                  props.setAddressComplement(event.target.value)
                }
              />
            </div>
            <div className="flex flex-col gap-2">
              <label
                htmlFor="address-reference"
                className="ml-1 leading-3 font-bold">
                Ponto de referência (opcional):
              </label>
              <Input
                id="address-reference"
                type="text"
                placeholder="Exemplo: Próximo à padaria"
                value={props.addressReference}
                onChange={event =>
                  props.setAddressReference(event.target.value)
                }
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
