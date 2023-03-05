import { useEffect, useMemo, useReducer } from 'react'
import { useParams } from 'react-router-dom'
import { ItemList } from '../components/item-list'
import {
  Size,
  complements as complementOptions,
  extras as extraOptions,
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

  const maxComplements = useMemo(() => {
    return products.find(product => slang(product.name) === item)
      ?.complements as number
  }, [item])

  const maxExtras = useMemo(() => {
    return products.find(product => slang(product.name) === item)
      ?.extras as number
  }, [item])

  const productSize = useMemo(() => {
    return products.find(product => slang(product.name) === item)?.size as Size
  }, [item])

  const [complements, addComplementEvent] = useReducer<
    typeof complementReducer
  >(
    complementReducer,
    complementOptions.map(complement => ({
      name: complement,
      count: 0,
      max: maxComplements,
      total: 0
    }))
  )

  const [extras, addExtraEvent] = useReducer<typeof complementReducer>(
    complementReducer,
    Object.entries(extraOptions).map(([extra, sizes]) => ({
      name: extra,
      count: 0,
      max: maxExtras,
      total: 0,
      price: sizes[productSize]
    }))
  )

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
    </div>
  )
}
