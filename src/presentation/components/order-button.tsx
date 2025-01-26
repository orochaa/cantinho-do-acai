import { Minus, Plus } from 'lucide-react'
import { useCallback, useState } from 'react'
import { useAlert } from '../context'
import { formatCurrency } from '../data'
import { Button } from './button'

export interface OrderButtonProps {
  product: Product
  multiple?: boolean
  totalPrice: number
  // eslint-disable-next-line @typescript-eslint/no-invalid-void-type
  validate?: () => string | void
  order: (count: number) => void
}

export function OrderButton(props: OrderButtonProps): React.JSX.Element {
  const { product, totalPrice, validate, order, multiple } = props

  const [counter, setCounter] = useState<number>(1)
  const { popMessage } = useAlert()

  const decrementCounter = useCallback((): void => {
    setCounter(c => (c > 1 ? c - 1 : 1))
  }, [setCounter])

  const incrementCounter = useCallback((): void => {
    setCounter(c => c + 1)
  }, [setCounter])

  const addOrder = useCallback(() => {
    const error = validate?.()

    if (typeof error === 'string' && !!error.trim()) {
      popMessage(error)
    } else {
      order(counter)
      popMessage(`${product.name} adicionado ao carrinho`)
    }
  }, [counter, order, popMessage, product.name, validate])

  return (
    <div className="mt-8 flex gap-2">
      {!!multiple && (
        <div className="flex items-center gap-3 rounded-xs border border-zinc-300 bg-zinc-100 p-1.5 shadow-sm">
          <button
            type="button"
            className="rounded-xs p-0.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
            title="Remover"
            onClick={decrementCounter}
            disabled={counter === 1}
          >
            <Minus className="size-5" />
          </button>
          <span>{counter}</span>
          <button
            type="button"
            className="rounded-xs p-0.5 text-red-500 active:bg-zinc-200"
            title="Adicionar"
            onClick={incrementCounter}
          >
            <Plus className="size-5" />
          </button>
        </div>
      )}
      <Button variant="confirm" className="grow" onClick={addOrder}>
        Adicionar ao Carrinho - {formatCurrency(totalPrice * counter)}
      </Button>
    </div>
  )
}
