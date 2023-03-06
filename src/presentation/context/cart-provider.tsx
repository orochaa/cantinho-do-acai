import { exhaustive } from 'exhaustive'
import { ReactNode, createContext, useContext, useReducer } from 'react'
import { Product } from '../helpers'

type CartItem = {
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
    }
  | {
      type: 'REMOVE'
      id: number
    }

type ICartContext = {
  addCartEvent: (event: CartEvent) => void
  cart: CartItem[]
}

const CartContext = createContext<ICartContext>({} as ICartContext)

function cartReducer(state: CartItem[], event: CartEvent): CartItem[] {
  return exhaustive(event, 'type', {
    ADD: e => {
      let total = e.item.product.price
      e.item.complements.forEach(complement => {
        total += complement.price ?? 0
      })
      return [...state, { ...e.item, id: state.length, total }]
    },
    REMOVE: e => state.filter(item => item.id !== e.id)
  })
}

export function CartProvider(props: { children: ReactNode }): JSX.Element {
  const [cart, addCartEvent] = useReducer(cartReducer, [])
  return (
    <CartContext.Provider value={{ cart, addCartEvent }}>
      {props.children}
    </CartContext.Provider>
  )
}

export function useCart(): ICartContext {
  return useContext(CartContext)
}
