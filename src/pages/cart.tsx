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

export function CartPage(): React.JSX.Element {
  const { addCartEvent, cart } = useCart()

  const [spoons, addSpoonEvent] = useComplements(
    [{ name: 'Sim, por favor' }, { name: 'Não, obrigado', count: 1 }],
    1
  )

  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [checkoutOption, setCheckoutOption] = useState<'delivery' | 'take-out'>(
    'take-out'
  )
  const [cep, setCep] = useState('')
  const [address, setAddress] = useState<CepAddress | null>(null)
  const [addressError, setAddressError] = useState<string | null>(null)
  const [cepLoading, setCepLoading] = useState(false)

  const navigate = useNavigate()

  const totalOrder = useMemo(() => {
    let total = 0

    for (const item of cart) {
      total += item.total
    }

    return total
  }, [cart])

  const handleCepChange = useCallback(async (cep: string) => {
    setCep(cep)
    if (cep.length === 8) {
      try {
        setCepLoading(true)
        const cepAddress = await getCepAddress(cep)
        setAddress(cepAddress)
        setAddressError(null)
      } catch (error) {
        setAddress(null)
        setAddressError('CEP não encontrado.')
      } finally {
        setCepLoading(false)
      }
    }
  }, [])

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
        item.observation ? `*Observação:*
${item.observation}` : '',
        '\n',
      ]
        .filter(Boolean)
        .join('\n')
    }

    msg += `Total: ${formatCurrency(total)}`

    if (spoons.complements[0].count === 1) {
      msg += '\n\nIncluir talheres, por favor.'
    }

    if (checkoutOption === 'delivery' && address) {
      msg += `\n\n*Endereço para entrega:*
${address.street}, ${address.neighborhood}, ${address.city} - ${address.state}, ${address.cep}`
    }

    const phone = '5554984312998'
    const url = `https://api.whatsapp.com/send?phone=${phone}&text=${encodeURI(msg)}`

    return url
  }, [cart, spoons.complements, checkoutOption, address])

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
          <Container>
            <h2 className="text-xl font-bold text-white">Opções de Entrega</h2>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="checkout"
                  value="take-out"
                  checked={checkoutOption === 'take-out'}
                  onChange={() => setCheckoutOption('take-out')}
                />
                <span className="text-white">Retirada no local</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="checkout"
                  value="delivery"
                  checked={checkoutOption === 'delivery'}
                  onChange={() => setCheckoutOption('delivery')}
                />
                <span className="text-white">Entrega</span>
              </label>
            </div>
          </Container>

          {checkoutOption === 'delivery' && (
            <Container>
              <h2 className="text-xl font-bold text-white">Endereço</h2>
              <div className="flex flex-col gap-2">
                <input
                  type="text"
                  placeholder="CEP (apenas números)"
                  className="rounded-sm p-2"
                  value={cep}
                  onChange={e => handleCepChange(e.target.value)}
                  maxLength={8}
                />
                {cepLoading && <p className="text-white">Buscando CEP...</p>}
                {addressError && (
                  <p className="text-red-500">{addressError}</p>
                )}
                {address && (
                  <div className="flex flex-col gap-1 text-white">
                    <p>Rua: {address.street}</p>
                    <p>Bairro: {address.neighborhood}</p>
                    <p>Cidade: {address.city}</p>
                    <p>Estado: {address.state}</p>
                  </div>
                )}
              </div>
            </Container>
          )}
        </div>

        {checkoutOption === 'take-out' && (
          <div className="mt-6 rounded-sm bg-yellow-100 p-4 text-pretty text-yellow-800">
            <p className="font-semibold">Atenção:</p>
            <p>
              Não fazemos entregas. Todos os pedidos devem ser retirados no
              local.
            </p>
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
            disabled={checkoutOption === 'delivery' && !address}
          >
            Confirmar Pedido
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
