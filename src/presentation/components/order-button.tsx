import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { Minus, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useAlert } from '../context'
import type { Product } from '../types'
import { Button } from './button'

export interface OrderButtonProps {
  product: Product
  multiple?: boolean
  totalPrice: number
  onOrder: (quantity: number) => void
}

export function OrderButton(props: OrderButtonProps): React.JSX.Element {
  const { product, totalPrice, onOrder, multiple } = props

  const [counter, setCounter] = useState<number>(1)
  const { popMessage } = useAlert()

  const decrementCounter = useCallback((): void => {
    setCounter(c => (c > 1 ? c - 1 : 1))
  }, [setCounter])

  const incrementCounter = useCallback((): void => {
    setCounter(c => c + 1)
  }, [setCounter])

  const addOrder = useCallback(() => {
    onOrder(counter)
    popMessage(`${product.name} adicionado ao carrinho`)
  }, [counter, onOrder, popMessage, product.name])

  return (
    <div className="mt-8 flex gap-2">
      {!!multiple && (
        <div className="flex items-center gap-3 rounded-sm border border-zinc-300 bg-zinc-100 p-1.5 shadow">
          <button
            type="button"
            className="rounded-sm p-0.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
            onClick={decrementCounter}
            disabled={counter === 1}
          >
            <Minus className="size-5" />
          </button>
          <span>{counter}</span>
          <button
            type="button"
            className="rounded-sm p-0.5 text-red-500 active:bg-zinc-200"
            onClick={incrementCounter}
          >
            <Plus className="size-5" />
          </button>
        </div>
      )}
      <Button
        variant="confirm"
        className="grow"
        disabled={totalPrice === 0}
        onClick={addOrder}
      >
        Adicionar R${formatCurrency(totalPrice * counter)}
      </Button>
    </div>
  )
}
