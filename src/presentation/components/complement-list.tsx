import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { Minus, Plus } from 'lucide-react'
import type { ComplementEvent, ComplementState } from '../hooks'

export interface ComplementListProps {
  title: string
  ctx: ComplementState
  addComplementEvent: (event: ComplementEvent) => void
}

export function ComplementList(props: ComplementListProps): React.JSX.Element {
  const { title, ctx, addComplementEvent } = props

  return (
    <div className="flex flex-col gap-2 rounded border border-amber-400/90 p-2 even:border-amber-700">
      <div className="m-1 text-white">
        <h2 className="text-xl font-bold">{title}:</h2>
        <p className="text-sm">
          Escolha até {ctx.countLimit} {ctx.countLimit > 1 ? 'opções' : 'opção'}
        </p>
      </div>
      {ctx.complements.map(complement => (
        <div
          key={complement.name}
          className="flex justify-between gap-2 rounded border border-black bg-zinc-100 p-2"
        >
          <p>{complement.name}</p>
          <div className="flex gap-1">
            {!!complement.price && (
              <div>
                {!!complement.count && '+'}R$
                {formatCurrency(
                  complement.count
                    ? complement.price * complement.count
                    : complement.price
                )}
              </div>
            )}
            <button
              type="button"
              className="text-red-500 disabled:text-zinc-500"
              disabled={complement.count === 0}
              onClick={() =>
                addComplementEvent({
                  type: 'REMOVE',
                  complement,
                })
              }
            >
              <Minus className="size-5" />
            </button>
            <span>{complement.count}</span>
            <button
              type="button"
              className="text-red-500 disabled:text-zinc-500"
              disabled={ctx.countTotal >= ctx.countLimit}
              onClick={() =>
                addComplementEvent({
                  type: 'ADD',
                  complement,
                })
              }
            >
              <Plus className="size-5" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
