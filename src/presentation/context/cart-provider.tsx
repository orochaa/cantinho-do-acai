import { exhaustive } from 'exhaustive'
import { createContext, useContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'
import type { Product } from '../types'

interface CartItem {
  id: number
  product: Product
  complements: {
    name: string
    count: number
    price?: number
  }[]
  total: number
}

type CartEvent =
  | {
      type: 'ADD'
      item: Omit<CartItem, 'id' | 'total'>
      initialPrice: number
    }
  | {
      type: 'REMOVE'
      id: number
    }

interface ICartContext {
  addCartEvent: (event: CartEvent) => void
  cart: CartItem[]
}

const CartContext = createContext<ICartContext>({
  cart: [],
  addCartEvent() {},
})

function cartReducer(state: CartItem[], event: CartEvent): CartItem[] {
  return exhaustive(event, 'type', {
    ADD: ({ initialPrice, item }) => {
      let total = initialPrice

      for (const complement of item.complements) {
        total += (complement.price ?? 0) * complement.count
      }

      return [...state, { ...item, id: state.length, total }]
    },
    REMOVE: e => state.filter(item => item.id !== e.id),
  })
}

export function CartProvider(props: {
  children: ReactNode
}): React.JSX.Element {
  const [cart, addCartEvent] = useReducer(cartReducer, [])

  const context = useMemo<ICartContext>(() => ({ cart, addCartEvent }), [cart])

  return (
    <CartContext.Provider value={context}>
      {props.children}
    </CartContext.Provider>
  )
}

export function useCart(): ICartContext {
  return useContext(CartContext)
}
