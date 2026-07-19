/* eslint-disable no-secrets/no-secrets */
import { Button } from '@/components/button';
import { Container } from '@/components/container';
import { QuantitySelector } from '@/components/multiple-options-selector';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import { useToast } from '@/context/toast-provider';
import { isOptionSelected, useSingleOption } from '@/hooks/use-single-option';
import { getCepAddress } from '@/lib/brasil-api';
import { formatCurrency, parseCurrency } from '@/lib/format';
// import {
//   COMPANY_COORDINATES,
//   calculateDistance,
//   calculateFare,
//   getCoordinates,
// } from '@/lib/geo'
import { ExternalLink, PlusSquare, X } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';

interface CepAddress {
  cep: string;
  state: string;
  city: string;
  neighborhood: string;
  street: string;
  service: string;
}

type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Dinheiro';

type SpoonOption = 'Não, obrigado' | 'Sim, por favor';

type CheckoutOption = 'Retirada no local' | 'Entrega (com taxa de entrega)';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const createMessageBuilder = () => {
  const parts: Array<string> = [];

  return {
    add: (text: string): void => {
      parts.push(text);
    },
    addConditional: (condition: unknown, text: string | (() => void)): void => {
      if (condition) {
        if (typeof text === 'function') {
          text();
        } else {
          parts.push(text);
        }
      }
    },
    build: (): string => parts.join('\n'),
  };
};

export function CartPage(): React.JSX.Element {
  const { addCartEvent, cart } = useCart();

  const [paymentMethod, selectPaymentMethod] = useSingleOption<PaymentMethod>([
    { name: 'PIX', isSelected: true },
    { name: 'Cartão de Crédito' },
    { name: 'Dinheiro' },
  ]);

  const [spoonOption, selectSpoonOption] = useSingleOption<SpoonOption>([
    { name: 'Não, obrigado', isSelected: true },
    { name: 'Sim, por favor' },
  ]);
  const [checkoutOption, selectCheckoutOption] =
    useSingleOption<CheckoutOption>([
      { name: 'Retirada no local', isSelected: true },
      { name: 'Entrega (com taxa de entrega)' },
    ]);

  const isDelivery = isOptionSelected(
    checkoutOption.options,
    'Entrega (com taxa de entrega)',
  );

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const toast = useToast();

  const [cep, setCep] = useState('');
  const [address, setAddress] = useState<CepAddress | null>(null);
  const [addressError, setAddressError] = useState<string | null>(null);
  const [cepLoading, setCepLoading] = useState(false);
  // const [deliveryFare, setDeliveryFare] = useState<number | null>(null)
  // const [distance, setDistance] = useState<number | null>(null)
  // const [fareLoading, setFareLoading] = useState(false)
  // const [fareError, setFareError] = useState<string | null>(null)
  const [addressNumber, setAddressNumber] = useState('');
  const [addressComplement, setAddressComplement] = useState('');
  const [addressReference, setAddressReference] = useState('');
  const [clientName, setClientName] = useState('');
  const [cashValue, setCashValue] = useState<string>('');

  const navigate = useNavigate();

  const totalOrder = useMemo(() => {
    let total = 0;

    for (const item of cart) {
      total += item.total;
    }

    // if (isDelivery && deliveryFare) {
    //   total += deliveryFare
    // }

    return total;
  }, [cart]);

  const change = useMemo(() => {
    const cash = parseCurrency(cashValue);

    if (
      isOptionSelected(paymentMethod.options, 'Dinheiro') &&
      !Number.isNaN(cash)
    ) {
      return cash - totalOrder;
    }

    return 0;
  }, [cashValue, paymentMethod, totalOrder]);

  const handleCepChange = useCallback(async (cep: string) => {
    cep = cep.replaceAll(/\D/g, '');

    setCep(cep);

    if (cep.length === 8) {
      let cepAddress: CepAddress | undefined;

      try {
        setCepLoading(true);
        cepAddress = await getCepAddress(cep);
        setAddress(cepAddress);
        setAddressError(null);
      } catch (error) {
        setAddress(null);
        setAddressError('CEP não encontrado.');
        console.error(error);
      } finally {
        setCepLoading(false);
      }
      // if (!cepAddress) {
      //   return
      // }

      // try {
      //   setFareLoading(true)
      //   const userCoords = await getCoordinates(cepAddress)
      //   const dist = calculateDistance(COMPANY_COORDINATES, userCoords)
      //   setDistance(dist)
      //   setDeliveryFare(calculateFare(dist))
      //   setFareError(null)
      // } catch (error) {
      //   setDistance(null)
      //   setDeliveryFare(null)
      //   setFareError('Não foi possível calcular a taxa de entrega.')
      //   console.error(error)
      // } finally {
      //   setFareLoading(false)
      // }
    }
  }, []);

  const goToWhatsappLink = useMemo((): string => {
    const builder = createMessageBuilder();
    let total = 0;

    builder.add('Olá, Cantinho do Açaí!');
    builder.add('Gostaria de fazer um pedido:');
    builder.add('');

    for (const item of cart) {
      total += item.total;
      const itemParts = [
        `*${item.count} - ${item.product.name}* ${
          item.product.price ? `- ${formatCurrency(item.product.price)}` : ''
        }`,
        ...item.options.map(
          complement =>
            `- ${complement.count} - ${complement.name}${
              complement.price ? ` - ${formatCurrency(complement.price)}` : ''
            }`,
        ),
      ];
      builder.add(itemParts.filter(Boolean).join('\n'));
      builder.addConditional(item.observation, () => {
        builder.add(`*Observação:*
${item.observation}`);
      });
    }

    builder.add('');
    builder.add('*Opção de Entrega*');
    builder.addConditional(isDelivery, () => {
      builder.add('Entrega (com taxa de entrega)');

      if (address && addressNumber) {
        builder.add(
          `Endereço: ${address.street}, ${addressNumber}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.cep}`,
        );
        builder.addConditional(addressComplement, () => {
          builder.add(`Complemento: ${addressComplement}`);
        });
        builder.addConditional(addressReference, () => {
          builder.add(`Ponto de referência: ${addressReference}`);
        });
      } else {
        builder.add('Endereço: (não informado por completo)');
        builder.addConditional(!address, '- Faltando CEP');
        builder.addConditional(!addressNumber, '- Faltando número');
      }

      // if (deliveryFare) {
      //   builder.add(`Taxa de entrega: ${formatCurrency(deliveryFare)}`)
      //   total += deliveryFare
      // } else {
      builder.add('Taxa de entrega: A calcular');
      // }
    });
    builder.addConditional(!isDelivery, () => {
      builder.add('Retirada no local');
    });

    builder.add('');
    builder.add(`*Total:* ${formatCurrency(total)}`);

    builder.addConditional(
      isOptionSelected(spoonOption.options, 'Sim, por favor'),
      () => {
        builder.add('');
        builder.add('Incluir talheres, por favor.');
      },
    );

    builder.add('');
    builder.add(
      `*Forma de Pagamento:* ${paymentMethod.options.find(option => option.isSelected)?.name}`,
    );
    builder.addConditional(
      isOptionSelected(paymentMethod.options, 'Dinheiro'),
      () => {
        builder.add(
          `Valor pago em dinheiro: ${formatCurrency(parseCurrency(cashValue))}`,
        );
        builder.add(`Troco: ${formatCurrency(change)}`);
      },
    );

    builder.add('');
    builder.add(`Nome: ${clientName}`);

    builder.add('');
    builder.add(
      '👆 Por favor, envie-nos esta mensagem agora. Assim que recebermos, estaremos atendendo você.',
    );

    const msg = builder.build();
    const phone = '5554984312998';
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURI(
      msg,
    )}`;

    return url;
  }, [
    isDelivery,
    spoonOption,
    clientName,
    cart,
    address,
    addressNumber,
    addressComplement,
    addressReference,
    paymentMethod,
    cashValue,
    change,
  ]);

  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleConfirmOrder = useCallback(() => {
    if (!clientName.trim()) {
      toast.error({ description: 'Por favor, informe o seu nome.' });

      return;
    }

    if (isDelivery) {
      if (!address) {
        toast.error({ description: 'Por favor, informe o seu CEP.' });

        return;
      }

      if (!addressNumber) {
        toast.error({
          description: 'Por favor, informe o número do seu endereço.',
        });

        return;
      }
    }

    if (isOptionSelected(paymentMethod.options, 'Dinheiro')) {
      const cash = parseCurrency(cashValue);

      if (Number.isNaN(cash) || cash < totalOrder) {
        toast.error({
          description:
            'Por favor, informe um valor em dinheiro igual ou superior ao total do pedido.',
        });

        return;
      }
    }

    openModal();
  }, [
    clientName,
    isDelivery,
    openModal,
    toast,
    address,
    addressNumber,
    paymentMethod,
    cashValue,
    totalOrder,
  ]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  return (
    <>
      <Seo
        title="Pedido - Cantinho do Açaí"
        description="Confira o seu pedido e finalize a sua compra no Cantinho do Açaí."
        imgUrl="https://cantinhodoacai.vercel.app/img/novo-logo.png"
      />
      <div className="mx-auto w-11/12 py-20">
        <div className="flex flex-col gap-8">
          <Container>
            <h2 className="ml-1 text-xl font-bold text-white">
              Pedido: {formatCurrency(totalOrder)}
            </h2>
            <div className="flex flex-col gap-2">
              {cart.map(
                ({ product, options, observation, count, total }, i) => (
                  <div
                    // biome-ignore lint/suspicious/noArrayIndexKey: TODO
                    key={i}
                    className="relative flex flex-col gap-2 rounded-sm bg-zinc-50 p-2 shadow-sm">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {count} - {product.name}{' '}
                        {!!product.price &&
                          `- ${formatCurrency(product.price)}`}
                      </h3>
                      <QuantitySelector
                        onCountChange={e => {
                          switch (e.type) {
                            case 'ADD':
                              addCartEvent({
                                type: 'update-quantity',
                                index: i,
                                count: count + 1,
                              });
                              break;
                            case 'REMOVE':
                              if (count > 1) {
                                addCartEvent({
                                  type: 'update-quantity',
                                  index: i,
                                  count: count - 1,
                                });
                              } else {
                                addCartEvent({
                                  type: 'remove',
                                  index: i,
                                });
                              }
                              break;
                          }
                        }}
                        item={{ name: product.name, count }}
                        ctx={{
                          countLimit: 15,
                          countTotal: cart.reduce(
                            (acc, item) => acc + item.count,
                            0,
                          ),
                        }}
                      />
                    </div>
                    <ul className="flex flex-col gap-1">
                      {options.map(complement => (
                        <li
                          key={complement.name}
                          className="flex items-center gap-1">
                          <PlusSquare
                            size={20}
                            className="text-pink-600"
                          />
                          {[
                            complement.count,
                            complement.name,
                            complement.price &&
                              formatCurrency(complement.price),
                          ]
                            .filter(Boolean)
                            .join(' - ')}
                        </li>
                      ))}
                    </ul>
                    {!!observation && (
                      <div>
                        <h3 className="font-semibold">Observação:</h3>
                        <p className="text-pretty whitespace-pre-line">
                          {observation}
                        </p>
                      </div>
                    )}
                    {options.length > 0 && (
                      <p className="font-semibold">
                        Total: {formatCurrency(total)}
                      </p>
                    )}
                  </div>
                ),
              )}
            </div>
          </Container>
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
                value={clientName}
                onChange={e => setClientName(e.target.value)}
              />
              <p className="ml-1 text-xs text-zinc-600">
                Para que possamos identificar o seu pedido.
              </p>
            </div>
          </Container>
          <SingleOptionSelector
            title="Precisa de talheres?"
            ctx={spoonOption}
            onSelectionChange={selectSpoonOption}
          />
          <SingleOptionSelector
            title="Opções de entrega"
            ctx={checkoutOption}
            onSelectionChange={selectCheckoutOption}
          />

          {!!isDelivery && (
            <Container>
              <h2 className="ml-1 text-xl font-bold text-white">
                Endereço de entrega
              </h2>
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
                  value={cep}
                  onChange={async e => handleCepChange(e.target.value)}
                  maxLength={9}
                />
                {cepLoading ? (
                  <p>Buscando CEP...</p>
                ) : addressError ? (
                  <p className="text-red-500">{addressError}</p>
                ) : (
                  !!address && (
                    <div className="flex flex-col gap-1">
                      <p>
                        <strong>Rua:</strong> {address.street}
                      </p>
                      <p>
                        <strong>Bairro:</strong> {address.neighborhood}
                      </p>
                      <p>
                        <strong>Cidade:</strong> {address.city}
                      </p>
                      <p>
                        <strong>Estado:</strong> {address.state}
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
                        value={addressNumber}
                        onChange={e => setAddressNumber(e.target.value)}
                      />

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
                        value={addressComplement}
                        onChange={e => setAddressComplement(e.target.value)}
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
                        value={addressReference}
                        onChange={e => setAddressReference(e.target.value)}
                      />
                    </div>
                  )
                )}
                {/* {fareLoading ? (
                  <p>Calculando taxa de entrega...</p>
                ) : fareError ? (
                  <p className="text-red-500">{fareError}</p>
                ) : (
                  !!(deliveryFare && distance !== null) && (
                    <div className="mt-2 flex flex-col gap-1 border-t border-zinc-300 pt-2">
                      <p>
                        <strong>Distância:</strong> {distance.toFixed(2)} km
                      </p>
                      <p>
                        <strong>Taxa de entrega:</strong>{' '}
                        {formatCurrency(deliveryFare)}
                      </p>
                      <p className="mt-1.5 text-zinc-600">
                        <span className="font-semibold">Observação:</span> Não
                        cobramos retorno
                      </p>
                      <p className="mt-1.5 text-xs text-zinc-600">
                        Dados de endereço © OpenStreetMap contributors
                      </p>
                    </div>
                  )
                )} */}
              </div>
            </Container>
          )}
          {!isDelivery && (
            <div className="rounded-sm bg-yellow-100 p-4 text-pretty text-yellow-800">
              <p className="font-semibold">Atenção:</p>
              <p>Retirar pedido no local, no endereço abaixo:</p>
              <p>
                Endereço: Rua Olinda de Almeida Lima, 249 - Charqueadas, Caxias
                do Sul - RS
              </p>
            </div>
          )}

          <SingleOptionSelector
            title="Forma de pagamento"
            ctx={paymentMethod}
            onSelectionChange={selectPaymentMethod}
          />

          {isOptionSelected(paymentMethod.options, 'Dinheiro') && (
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
                  <button
                    type="button"
                    className="rounded border border-zinc-300 bg-zinc-200 px-2 py-1.5"
                    onClick={() =>
                      setCashValue(
                        formatCurrency(
                          parseCurrency(cashValue) +
                            Math.max(totalOrder - parseCurrency(cashValue), 0),
                        ),
                      )
                    }>
                    +
                    {formatCurrency(
                      Math.max(totalOrder - parseCurrency(cashValue), 0),
                    )}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-zinc-300 bg-zinc-200 px-2 py-1.5"
                    onClick={() =>
                      setCashValue(
                        formatCurrency(parseCurrency(cashValue) + 20),
                      )
                    }>
                    +{formatCurrency(20)}
                  </button>
                  <button
                    type="button"
                    className="rounded border border-zinc-300 bg-zinc-200 px-2 py-1.5"
                    onClick={() =>
                      setCashValue(
                        formatCurrency(parseCurrency(cashValue) + 50),
                      )
                    }>
                    +{formatCurrency(50)}
                  </button>
                </div>
                <input
                  id="cash-value"
                  type="text"
                  inputMode="numeric"
                  placeholder="Digite outro valor que você irá pagar em dinheiro"
                  className="w-full rounded-sm border border-zinc-300 p-2 shadow-sm"
                  value={cashValue}
                  onChange={e => setCashValue(e.target.value)}
                />
                <p className="text-sm text-zinc-600">
                  Informe o valor que você irá pagar em dinheiro, para que
                  possamos providenciar o troco.
                </p>
                <p className="text-sm text-zinc-600">
                  <span className="font-semibold">Troco:</span>{' '}
                  {formatCurrency(change)}
                </p>
              </div>
            </Container>
          )}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button
            variant="cancel"
            onClick={async () => navigate('/')}>
            Continuar Escolhendo
          </Button>
          <Button
            variant="confirm"
            onClick={handleConfirmOrder}>
            Confirmar Pedido {formatCurrency(totalOrder)}
          </Button>
        </div>

        {!!modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/** biome-ignore lint/a11y/noNoninteractiveElementInteractions: TODO */}
            {/** biome-ignore lint/a11y/noStaticElementInteractions: TODO */}
            {/** biome-ignore lint/a11y/useKeyWithClickEvents: TODO */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={closeModal}
            />
            <div className="z-10 w-11/12 max-w-2xl rounded-lg bg-white p-6 shadow-lg">
              <div className="flex items-start">
                <h2 className="grow text-center text-2xl font-semibold">
                  ATENÇÃO
                </h2>
                <button
                  type="button"
                  className="rounded-sm p-0.5 text-gray-600 hover:text-zinc-800 active:bg-zinc-200"
                  title="Fechar modal"
                  onClick={closeModal}>
                  <X className="size-5" />
                </button>
              </div>
              <p className="my-4">
                Ao clicar no botão <b>&quot;Continuar&quot;</b>, você será
                redirecionado para o WhatsApp do Cantinho do Açaí, com uma
                mensagem pré-escrita contendo todos os detalhes do seu pedido.
                Basta enviá-la para finalizar seu pedido! 😁
              </p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="cancel"
                  className="border-zinc-300 transition hover:border-zinc-500"
                  onClick={closeModal}>
                  Cancelar
                </Button>
                <Button
                  variant="confirm"
                  className="items-start border-zinc-300 bg-green-500 hover:border-zinc-500"
                  onClick={() => window.open(goToWhatsappLink, '_blank')}>
                  <ExternalLink className="size-5" />
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
