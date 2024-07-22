import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { clsx } from 'clsx'
import { Minus, Plus } from 'lucide-react'
import { useState } from 'react'
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

      {ctx.complements.map(complement => {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const [activeButton, setActiveButton] = useState(false)

        return (
          <div
            key={complement.name}
            className={clsx(
              'flex items-center gap-2 rounded bg-zinc-100 p-2',
              activeButton ? 'bg-zinc-200' : 'bg-zinc-100'
            )}
          >
            <button
              type="button"
              className="flex grow flex-col md:flex-row md:items-center md:justify-between"
              onClick={() => addComplementEvent({ type: 'ADD', complement })}
              onPointerDown={() => setActiveButton(true)}
              onPointerUp={() => setActiveButton(false)}
              onPointerLeave={() => setActiveButton(false)}
            >
              <p className="text-base md:text-lg">{complement.name}</p>
              {!!complement.price && (
                <span className="text-[0.8rem] tracking-tight md:text-base">
                  + R$ {formatCurrency(complement.price)}
                </span>
              )}
            </button>

            {complement.count > 0 ? (
              <div className="flex items-center gap-3 rounded-sm border border-zinc-300 bg-zinc-100 p-1.5 shadow">
                <button
                  type="button"
                  className="rounded-sm p-0.5 text-red-500 active:bg-zinc-200"
                  onClick={() =>
                    addComplementEvent({ type: 'REMOVE', complement })
                  }
                >
                  <Minus className="size-5" />
                </button>
                <span>{complement.count}</span>
                <button
                  type="button"
                  className="rounded-sm p-0.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
                  disabled={ctx.countTotal >= ctx.countLimit}
                  onClick={() =>
                    addComplementEvent({ type: 'ADD', complement })
                  }
                >
                  <Plus className="size-5" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="block h-[2.4rem] rounded-sm p-0.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
                disabled={ctx.countTotal >= ctx.countLimit}
                onClick={() => addComplementEvent({ type: 'ADD', complement })}
              >
                <Plus className="size-5" />
              </button>
            )}
          </div>
        )
      })}
    </div>
  )
}
