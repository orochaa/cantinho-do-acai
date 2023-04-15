import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { PlusSquare, XIcon } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context'

export function CartPage(): JSX.Element {
  const { addCartEvent, cart } = useCart()

  const navigate = useNavigate()

  const totalOrder = useMemo(() => {
    let total = 0
    cart.forEach(item => {
      total += item.total
    })
    return total
  }, [cart.length])

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/')
    }
  }, [cart])

  const goToWhatsappLink = useMemo((): string => {
    const base = 'https://wa.me/5554984312998?text='
    let text = 'Olá Cantinho do Açaí gostaria de pedir:\n\n'
    let total = 0

    cart.forEach(item => {
      total += item.total
      text += [
        `${item.product.name} - R$${formatCurrency(item.product.price)}`,
        ...item.complements.map(complement => {
          return `- ${complement.count} - ${complement.name}${
            complement.price ? ` - R$${formatCurrency(complement.price)}` : ''
          }`
        }),
        '\n'
      ].join('\n')
    })

    text += `Total: R$${formatCurrency(total)}`

    return base + encodeURIComponent(text)
  }, [cart])

  return (
    <>
      <h2 className="p-1 text-xl font-bold text-white">Pedido:</h2>
      <div className="rounded border border-violet-500/90 p-2">
        <div className="flex flex-col gap-2 ">
          {cart.map(({ id, product, complements, total }) => (
            <div
              key={id}
              className="relative flex flex-col gap-2 rounded bg-zinc-50 p-2 shadow"
            >
              <button
                className="absolute right-1 top-1 text-red-600"
                onClick={() => addCartEvent({ type: 'REMOVE', id })}
              >
                <XIcon size={22} />
              </button>
              <h3 className="text-center font-semibold">
                {product.name} - R$
                {formatCurrency(product.price)}
              </h3>
              <ul className="flex flex-col gap-1">
                {complements.map(complement => (
                  <li key={complement.name} className="flex items-center gap-1">
                    <PlusSquare size={20} className="text-pink-600" />
                    {complement.count} - {complement.name}
                    {!!complement.price &&
                      ` - R$${formatCurrency(
                        complement.count * complement.price
                      )}`}
                  </li>
                ))}
              </ul>
              <p className="text-center font-semibold">
                Total: R${formatCurrency(total)}
              </p>
            </div>
          ))}
        </div>
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
