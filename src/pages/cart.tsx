import { Button } from '@/components/button'
import { Container } from '@/components/container'
import {
  MultiComponentsContainer,
  OrderComplements,
} from '@/components/order-complements'
import { Seo } from '@/components/seo'
import { useCart } from '@/context/cart-provider'
import { useComplements } from '@/hooks/use-complements'
import { getCepAddress } from '@/lib/brasil-api'
import { formatCurrency } from '@/lib/format'
import { calculateDistance, calculateFare, getCoordinates } from '@/lib/geo'
import { ExternalLink, PlusSquare, X } from 'lucide-react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

interface CepAddress {
  cep: string
  state: string
  city: string
  neighborhood: string
  street: string
  service: string
}

interface Coordinates {
  lat: number
  lon: number
}

export function CartPage(): React.JSX.Element {
  const { addCartEvent, cart } = useCart()

  const [spoons, addSpoonEvent] = useComplements(
    [{ name: 'Não, obrigado', count: 1 }, { name: 'Sim, por favor' }],
    1
  )
  const [checkoutOption, addCheckoutOptionEvent] = useComplements(
    [
      { name: 'Retirada no local', count: 1 },
      { name: 'Entrega (com taxa de entrega)' },
    ],
    1
  )
  const isDelivery = checkoutOption.complements[1].count === 1

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const [cep, setCep] = useState('')
  const [address, setAddress] = useState<CepAddress | null>(null)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [cepLoading, setCepLoading] = useState(false)
  const [deliveryFare, setDeliveryFare] = useState<number | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [fareLoading, setFareLoading] = useState(false)
  const [companyCoords, setCompanyCoords] = useState<Coordinates | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    getCoordinates(
      'Rua Olinda de Almeida Lima, 249, Caxias do Sul, Rio Grande do Sul, Brasil'
    )
      .then(setCompanyCoords)
      .catch(console.error)
  }, [])

  const totalOrder = useMemo(() => {
    let total = 0

    for (const item of cart) {
      total += item.total
    }

    if (isDelivery && deliveryFare) {
      total += deliveryFare
    }

    return total
  }, [cart, deliveryFare, isDelivery])

  const handleCepChange = useCallback(
    async (cep: string) => {
      setCep(cep)

      if (cep.length === 8) {
        try {
          setCepLoading(true)
          const cepAddress = await getCepAddress(cep)
          setAddress(cepAddress)
          setAddressError(null)

          if (companyCoords) {
            setFareLoading(true)
            const userCoords = await getCoordinates(
              `${cepAddress.street}, ${cepAddress.city}, ${cepAddress.state}`
            )
            const dist = calculateDistance(companyCoords, userCoords)
            setDistance(dist)
            setDeliveryFare(calculateFare(dist))
            setFareLoading(false)
          }
        } catch (error) {
          setAddress(null)
          setAddressError('CEP não encontrado.')
          console.error(error)
        } finally {
          setCepLoading(false)
        }
      }
    },
    [companyCoords]
  )

  const goToWhatsappLink = useMemo((): string => {
    let msg = 'Olá, Cantinho do Açaí!\nGostaria de fazer um pedido:\n\n'
    let total = 0

    for (const item of cart) {
      total += item.total
      msg += [
        `*${item.count} - ${item.product.name}* ${item.product.price ? `- ${formatCurrency(item.product.price)}` : ''}`,
        ...item.complements.map(complement => {
          return `- ${complement.count} - ${complement.name}${
            complement.price ? ` - ${formatCurrency(complement.price)}` : ''
          }`
        }),
        item.observation ? `*Observação:*\n${item.observation}` : '',
      ]
        .filter(Boolean)
        .join('\n')
    }

    if (isDelivery && address) {
      msg += `\n\n*Endereço para entrega:*\n${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.cep}`

      if (deliveryFare) {
        msg += `\nTaxa de entrega: ${formatCurrency(deliveryFare)}`
        total += deliveryFare
      }
    }

    msg += `\n\n*Total:* ${formatCurrency(total)}`

    if (spoons.complements[0].count === 1) {
      msg += '\n\nIncluir talheres, por favor.'
    }

    const phone = '5554984312998'
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURI(msg)}`

    return url
  }, [isDelivery, address, spoons.complements, cart, deliveryFare])

  const openModal = useCallback(() => {
    setModalOpen(true)
  }, [])

  const closeModal = useCallback(() => {
    setModalOpen(false)
  }, [])

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/')
    }
  }, [cart, navigate])

  return (
    <>
      <Seo
        title="Carrinho - Cantinho do Açaí"
        description="Confira o seu pedido e finalize a sua compra no Cantinho do Açaí."
        imgUrl="https://cantinhodoacai.vercel.app/img/novo-logo.png"
      />
      <div className="mx-auto w-11/12 py-20">
        <div className="flex flex-col gap-8">
          <Container>
            <h2 className="text-xl font-bold text-white">
              Pedido: {formatCurrency(totalOrder)}
            </h2>
            <div className="flex flex-col gap-2">
              {cart.map(
                ({ product, complements, observation, count, total }, i) => (
                  <div
                    // eslint-disable-next-line react/no-array-index-key
                    key={i}
                    className="relative flex flex-col gap-2 rounded-sm bg-zinc-50 p-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">
                        {count} - {product.name}{' '}
                        {!!product.price &&
                          `- ${formatCurrency(product.price)}`}
                      </h3>
                      <MultiComponentsContainer
                        addComplementEvent={e => {
                          switch (e.type) {
                            case 'ADD':
                              addCartEvent({
                                type: 'UPDATE-QUANTITY',
                                index: i,
                                count: count + 1,
                              })
                              break
                            case 'REMOVE':
                              if (count > 1) {
                                addCartEvent({
                                  type: 'UPDATE-QUANTITY',
                                  index: i,
                                  count: count - 1,
                                })
                              } else {
                                addCartEvent({
                                  type: 'REMOVE',
                                  index: i,
                                })
                              }
                              break
                            case 'SELECT':
                          }
                        }}
                        complement={{ name: product.name, count }}
                        ctx={{
                          countLimit: 15,
                          complements: cart.map(item => ({
                            name: item.product.name,
                            count: item.count,
                          })),
                          countTotal: cart.reduce(
                            (acc, item) => acc + item.count,
                            0
                          ),
                        }}
                      />
                    </div>
                    <ul className="flex flex-col gap-1">
                      {complements.map(complement => (
                        <li
                          key={complement.name}
                          className="flex items-center gap-1"
                        >
                          <PlusSquare size={20} className="text-pink-600" />
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
                    {complements.length > 0 && (
                      <p className="font-semibold">
                        Total: {formatCurrency(total)}
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </Container>
          <OrderComplements
            title="Precisa de talheres?"
            ctx={spoons}
            addComplementEvent={addSpoonEvent}
          />
          <OrderComplements
            title="Opções de Entrega"
            ctx={checkoutOption}
            addComplementEvent={addCheckoutOptionEvent}
          />

          {!!isDelivery && (
            <Container>
              <h2 className="text-xl font-bold text-white">Endereço</h2>
              <div className="flex flex-col gap-2 rounded-sm bg-zinc-100 px-2 py-4">
                <label htmlFor="cep" className="ml-1 leading-3 font-bold">
                  CEP:
                </label>
                <input
                  id="cep"
                  type="text"
                  placeholder="Digite o CEP"
                  className="w-full rounded-sm border border-zinc-300 p-2 shadow-sm"
                  value={cep}
                  onChange={async e => handleCepChange(e.target.value)}
                  maxLength={8}
                />
                {!!addressError && (
                  <p className="text-red-500">{addressError}</p>
                )}
                {cepLoading ? (
                  <p>Buscando CEP...</p>
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
                    </div>
                  )
                )}
                {fareLoading ? (
                  <p>Calculando taxa de entrega...</p>
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
                    </div>
                  )
                )}
              </div>
            </Container>
          )}
        </div>

        {!isDelivery && (
          <div className="mt-6 rounded-sm bg-yellow-100 p-4 text-pretty text-yellow-800">
            <p className="font-semibold">Atenção:</p>
            <p>Retirar pedido no local, no endereço abaixo:</p>
            <p>
              Endereço: Rua Olinda de Almeida Lima, 249 - Charqueadas, Caxias do
              Sul - RS
            </p>
          </div>
        )}

        <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
          <Button variant="cancel" onClick={async () => navigate('/')}>
            Continuar Escolhendo
          </Button>
          <Button
            variant="confirm"
            onClick={openModal}
            disabled={!!isDelivery && !address}
          >
            Confirmar Pedido {formatCurrency(totalOrder)}
          </Button>
        </div>

        {!!modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
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
                  onClick={closeModal}
                >
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
                  onClick={closeModal}
                >
                  Cancelar
                </Button>
                <Button
                  variant="confirm"
                  className="items-start border-zinc-300 bg-green-500 hover:border-zinc-500"
                  onClick={() => window.open(goToWhatsappLink, '_blank')}
                >
                  <ExternalLink className="size-5" />
                  Continuar
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
