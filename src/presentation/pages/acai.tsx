import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { ShoppingCart } from 'lucide-react'
import { useMemo, useReducer } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ItemList } from '../components/item-list'
import { useAlert, useCart } from '../context'
import { acai, complementReducer, slang } from '../data'

export function AcaiPage(): JSX.Element {
  const { item } = useParams()

  const { addCartEvent } = useCart()
  const { popMessage } = useAlert()

  const product = useMemo(() => {
    const defaultValue = acai.products[0]

    if (!item) {
      return defaultValue
    }

    const desiredProduct = acai.products.find(
      product => slang(product.name) === slang(item)
    )

    return desiredProduct ?? defaultValue
  }, [item])

  const [complements, addComplementEvent] = useReducer<
    typeof complementReducer
  >(
    complementReducer,
    acai.complements.map(complement => ({
      name: complement,
      count: 0,
      max: product.complements,
      total: 0,
    }))
  )

  const [extras, addExtraEvent] = useReducer<typeof complementReducer>(
    complementReducer,
    Object.entries(acai.extras).map(([extra, sizes]) => ({
      name: extra,
      count: 0,
      max: product.extras,
      total: 0,
      price: sizes[product.size],
    }))
  )

  const total = useMemo(() => {
    let result = product.price

    for (const extra of extras) {
      if (extra.price !== undefined) {
        result += extra.count * extra.price
      }
    }

    return result
  }, [product, extras])

  return (
    <>
      <div className="flex flex-col gap-8">
        <ItemList
          addComplementEvent={addComplementEvent}
          complements={complements}
          title="Acompanhamentos"
        />
        <ItemList
          addComplementEvent={addExtraEvent}
          complements={extras}
          title="Adicionais"
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
                  complements: [...complements, ...extras]
                    .filter(i => i.count > 0)
                    .map(i => ({
                      count: i.count,
                      name: i.name,
                      price: i.price,
                    })),
                },
                initialPrice: product.price,
              })
              popMessage(`${product.name} adicionado ao carrinho`)
            }}
          >
            Adicionar R${formatCurrency(total)}
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
