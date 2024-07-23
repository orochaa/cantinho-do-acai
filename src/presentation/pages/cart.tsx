import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { PlusSquare, Trash2 } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Container, OrderComplements } from '../components'
import { useCart } from '../context'
import { useComplements } from '../hooks'

export function CartPage(): React.JSX.Element {
  const { addCartEvent, cart } = useCart()
  const [spoons, addSpoonEvent] = useComplements(
    [{ name: 'Sim, por favor' }, { name: 'Não, obrigado', count: 1 }],
    1
  )

  const navigate = useNavigate()

  const totalOrder = useMemo(() => {
    let total = 0

    for (const item of cart) {
      total += item.total * item.quantity
    }

    return total
  }, [cart])

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/')
    }
  }, [cart, navigate])

  const goToWhatsappLink = useMemo((): string => {
    const base = 'https://wa.me/5554984312998?text='
    let text = 'Olá, Cantinho do Açaí!\nGostaria de fazer um pedido:\n\n'
    let total = 0

    for (const item of cart) {
      total += item.total * item.quantity
      text += [
        `${item.quantity} - ${item.product.name} - R$${formatCurrency(item.product.price)}`,
        ...item.complements.map(complement => {
          return `- ${complement.count} - ${complement.name}${
            complement.price ? ` - R$${formatCurrency(complement.price)}` : ''
          }`
        }),
        '\n',
      ].join('\n')
    }

    text += `Total: R$${formatCurrency(total)}`

    if (spoons.complements[0].count === 1) {
      text += '\n\nIncluir talheres, por favor.'
    }

    return base + encodeURIComponent(text)
  }, [cart, spoons.complements])

  return (
    <>
      <div className="flex flex-col gap-8">
        <Container>
          <h2 className="text-xl font-bold text-white">Pedido:</h2>
          <div className="flex flex-col gap-2">
            {cart.map(({ product, complements, total, quantity }, i) => (
              <div
                key={i}
                className="relative flex flex-col gap-2 rounded bg-zinc-50 p-2 shadow"
              >
                <div className="flex items-center justify-between gap-2 px-2 font-semibold">
                  <span>{quantity}</span>
                  <h3>
                    {product.name} - R${formatCurrency(product.price)}
                  </h3>
                  <button
                    type="button"
                    className="rounded p-0.5 text-red-600 active:bg-zinc-200 active:text-red-500"
                    onClick={() => addCartEvent({ type: 'REMOVE', index: i })}
                  >
                    <Trash2 className="size-5" />
                  </button>
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
                          `R$${formatCurrency(complement.price)}`,
                      ]
                        .filter(Boolean)
                        .join(' - ')}
                    </li>
                  ))}
                </ul>
                {complements.length > 0 && (
                  <p className="text-center font-semibold">
                    Total: R${formatCurrency(total * quantity)}
                  </p>
                )}
              </div>
            ))}
          </div>
        </Container>
        <OrderComplements
          title="Precisa de talheres?"
          ctx={spoons}
          addComplementEvent={addSpoonEvent}
        />
      </div>

      <div className="mx-auto mt-4 grid grid-cols-2 gap-2 text-center">
        <Link
          to="/"
          className="rounded border border-white bg-zinc-100 p-2 hover:bg-zinc-100/90"
        >
          Voltar
        </Link>
        <a
          href={goToWhatsappLink}
          target="_blank"
          rel="noreferrer"
          className="rounded border border-red-300 bg-red-500 p-2 text-white hover:border-red-400 hover:bg-red-500/90"
        >
          Confirmar R${formatCurrency(totalOrder)}
        </a>
      </div>
    </>
  )
}
