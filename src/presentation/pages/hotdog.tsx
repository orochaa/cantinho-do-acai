import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { ShoppingCart } from 'lucide-react'
import { useReducer } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ItemList } from '../components/item-list'
import { useAlert, useCart } from '../context'
import { complementReducer, hotdog, slang } from '../data'
import { Product } from '../types'

export function HotdogPage(): JSX.Element {
  const { item } = useParams()
  const product = hotdog.products.find(
    product => slang(product.name) === slang(item as string)
  ) as Product

  const { addCartEvent } = useCart()
  const { popMessage } = useAlert()

  const [complements, addComplementEvent] = useReducer<
    typeof complementReducer
  >(
    complementReducer,
    hotdog.complements.map(complement => ({
      name: complement,
      count: 1,
      max: hotdog.complements.length,
      total: hotdog.complements.length
    }))
  )

  return (
    <>
      <div className="flex flex-col gap-8">
        <ItemList
          addComplementEvent={addComplementEvent}
          complements={complements}
          title="Ingredientes"
        />
      </div>
      <div className="mx-auto mt-8 grid grid-rows-2 gap-2">
        <div className="grid grid-cols-2 gap-2 text-center">
          <Link
            to="/"
            className="rounded border border-white bg-zinc-200 p-2 hover:border-zinc-400 hover:bg-zinc-300/90"
          >
            Voltar
          </Link>
          <button
            className="rounded border border-red-300 bg-red-500 p-2 text-white hover:border-red-400 hover:bg-red-500/90"
            onClick={() => {
              addCartEvent({
                type: 'ADD',
                item: {
                  product,
                  complements
                },
                initialPrice: product.price
              })
              popMessage(`${product.name} adicionado ao carrinho`)
            }}
          >
            Adicionar R${formatCurrency(product.price)}
          </button>
        </div>
        <Link
          to="/cart"
          className="flex items-center justify-center gap-2 rounded border-2 border-red-600 bg-zinc-50 p-2 font-semibold"
        >
          <ShoppingCart size={22} className="text-red-600" /> Ver carrinho
        </Link>
      </div>
    </>
  )
}
