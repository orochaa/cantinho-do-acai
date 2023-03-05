import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { useId, useMemo, useReducer } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ItemList } from '../components/item-list'
import { useAlert, useCart } from '../context'
import {
  Product,
  Size,
  complements as complementOptions,
  extras as extraOptions,
  parseSlang,
  products,
  slang
} from '../helpers'

export type ComplementState = {
  name: string
  count: number
  total: number
  max: number
  price?: number
}

export type ComplementEvent = {
  type: 'ADD' | 'REMOVE'
  complement: string
}

function complementReducer(
  state: ComplementState[],
  event: ComplementEvent
): ComplementState[] {
  return state.map(complement => {
    const calc = (field: 'count' | 'total'): number => {
      const result = complement[field] + (event.type === 'ADD' ? 1 : -1)
      return complement.total < complement.max
        ? result > 0
          ? result < complement.max
            ? result
            : complement.max
          : 0
        : event.type === 'REMOVE'
        ? result
        : complement[field]
    }
    const total = calc('total')
    if (complement.name === event.complement) {
      return {
        name: complement.name,
        count: calc('count'),
        max: complement.max,
        price: complement.price,
        total
      }
    }
    return {
      ...complement,
      total
    }
  })
}

export function ComplementsPage(): JSX.Element {
  const { item } = useParams()
  const product = products.find(
    product => slang(product.name) === item
  ) as Product

  const { addCartEvent } = useCart()
  const { popMessage } = useAlert()
  const navigate = useNavigate()

  const [complements, addComplementEvent] = useReducer<
    typeof complementReducer
  >(
    complementReducer,
    complementOptions.map(complement => ({
      name: complement,
      count: 0,
      max: product.complements,
      total: 0
    }))
  )

  const [extras, addExtraEvent] = useReducer<typeof complementReducer>(
    complementReducer,
    Object.entries(extraOptions).map(([extra, sizes]) => ({
      name: extra,
      count: 0,
      max: product.extras,
      total: 0,
      price: sizes[product.size]
    }))
  )

  const total = useMemo(() => {
    let result = 0
    result += product.price
    extras.forEach(extra => {
      result += extra.count * (extra.price as number)
    })
    return result
  }, [product, extras])

  return (
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
      <div className="mx-auto flex gap-2">
        <button
          className="w-20 rounded border border-white bg-zinc-200 p-2 hover:border-zinc-400 hover:bg-zinc-300/90"
          onClick={() => navigate('/')}
        >
          Voltar
        </button>
        <button
          className="rounded border border-red-300 bg-red-500 p-2 text-white/90 hover:border-red-400 hover:bg-red-500/90"
          onClick={() => {
            addCartEvent({
              type: 'ADD',
              item: {
                name: product.name,
                price: product.price,
                complements: complements
                  .concat(extras)
                  .filter(i => i.count > 0)
                  .map(i => ({
                    count: i.count,
                    name: i.name,
                    price: i.price
                  }))
              }
            })
            popMessage(`${product.name} adicionado ao carrinho`)
          }}
        >
          Adicionar R${formatCurrency(total)}
        </button>
      </div>
    </div>
  )
}
