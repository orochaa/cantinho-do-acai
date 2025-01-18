import { exhaustive } from 'exhaustive'
import { createContext, useContext, useMemo, useReducer } from 'react'
import type { ReactNode } from 'react'

interface CartItem {
  product: Product
  complements: Complement[]
  count: number
  total: number
}

type CartEvent =
  | {
      type: 'ADD'
      item: Omit<CartItem, 'total'>
    }
  | {
      type: 'REMOVE'
      index: number
    }
  | {
      type: 'UPDATE-QUANTITY'
      index: number
      count: number
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
    ADD: ({ item }) => {
      let total = item.product.price
      const complements: Complement[] = []

      for (const complement of item.complements) {
        if (complement.count > 0) {
          complements.push(complement)
          total += (complement.price ?? 0) * complement.count
        }
      }

      return [...state, { ...item, complements, total: total * item.count }]
    },
    REMOVE: ({ index }) => state.filter((_, i) => i !== index),
    'UPDATE-QUANTITY': ({ index, count }) => {
      const updatedCart = [...state]
      const item = updatedCart[index]
      let total = item.product.price

      for (const complement of item.complements) {
        total += (complement.price ?? 0) * complement.count
      }

      updatedCart[index] = { ...item, count, total: total * count }

      return updatedCart
    },
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
