import { formatCurrency } from '@brazilian-utils/brazilian-utils'
import { Minus, Plus } from 'lucide-react'
import type { Complement, ComplementEvent } from '../hooks'

export interface ComplementListProps {
  title: string
  complements: Complement[]
  addComplementEvent: (event: ComplementEvent) => void
}

export function ComplementList(props: ComplementListProps): React.JSX.Element {
  const { title, complements, addComplementEvent } = props

  return (
    <div className="flex flex-col gap-2 rounded border border-amber-400/90 p-2 even:border-amber-700">
      <div className="m-1 text-white">
        <h2 className="text-xl font-bold">{title}:</h2>
        <p className="text-sm">
          Escolha até {complements[0].countLimit}{' '}
          {complements[0].countLimit > 1 ? 'opções' : 'opção'}
        </p>
      </div>
      {complements.map(complement => (
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
              onClick={() =>
                addComplementEvent({
                  type: 'REMOVE',
                  complement,
                })
              }
            >
              <Minus size={20} className="text-red-500" />
            </button>
            <span>{complement.count}</span>
            <button
              type="button"
              onClick={() =>
                addComplementEvent({
                  type: 'ADD',
                  complement,
                })
              }
            >
              <Plus size={20} className="text-red-500" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
