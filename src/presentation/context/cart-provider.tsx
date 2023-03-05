import { exhaustive } from 'exhaustive'
import { ReactNode, createContext, useContext, useReducer } from 'react'

type CartItem = {
  id: number
  name: string
  price: number
  complements: {
    name: string
    count: number
    price?: number
  }[]
}

type CartEvent =
  | {
      type: 'ADD'
      item: Omit<CartItem, 'id'>
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
    ADD: e => [...state, { ...e.item, id: state.length }],
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
