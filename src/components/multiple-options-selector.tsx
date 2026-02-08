/* eslint-disable react/no-multi-comp */
import type {
  MultipleOptionsEvent,
  MultipleOptionsState,
} from '@/hooks/use-multiple-options'
import { formatCurrency } from '@/lib/format'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Container } from './container'

export interface MultipleOptionsSelectorProps<TName extends string> {
  title: string
  ctx: MultipleOptionsState<TName>
  dispatchEvent: (event: MultipleOptionsEvent<TName>) => void
}

export function MultipleOptionsSelector<TName extends string>(
  props: MultipleOptionsSelectorProps<TName>
): React.JSX.Element {
  const { title, ctx, dispatchEvent } = props

  return (
    <Container>
      <div className="m-1 text-white">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">Escolha até {ctx.countLimit} opções</p>
      </div>

      {ctx.options.map(option => (
        <div
          key={option.name}
          className="flex rounded-sm bg-zinc-100 active:bg-zinc-200"
        >
          <button
            type="button"
            className="flex h-[3.5rem] grow flex-col justify-center p-3 md:flex-row md:items-center md:justify-between"
            onClick={() => dispatchEvent({ type: 'ADD', option })}
          >
            <p className="text-left text-base md:text-lg">{option.name}</p>
            {!!option.price && (
              <span className="text-left text-[0.8rem] tracking-tight whitespace-nowrap md:text-base">
                + {formatCurrency(option.price)}
              </span>
            )}
          </button>

          <div className="h-[3.5rem]">
            {option.count === 0 ? (
              <AddOptionButton
                dispatchEvent={dispatchEvent}
                option={option}
                ctx={ctx}
              />
            ) : (
              <QuantitySelector
                onCountChange={dispatchEvent}
                item={option}
                ctx={ctx}
              />
            )}
          </div>
        </div>
      ))}
    </Container>
  )
}

interface AddOptionButtonProps<TName extends string> {
  option: Option<TName>
  ctx: MultipleOptionsState<TName>
  dispatchEvent: (event: MultipleOptionsEvent<TName>) => void
}

function AddOptionButton<TName extends string>(
  props: AddOptionButtonProps<TName>
): React.JSX.Element {
  const { dispatchEvent, option, ctx } = props

  return (
    <button
      type="button"
      className="flex h-full items-center justify-center rounded-xs p-3 pl-0 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
      title="Adicionar"
      disabled={ctx.countTotal >= ctx.countLimit}
      onClick={() => dispatchEvent({ type: 'ADD', option })}
    >
      <Plus className="size-5" />
    </button>
  )
}

interface QuantitySelectorProps<TName extends string> {
  item: Option<TName>
  ctx: Pick<MultipleOptionsState<TName>, 'countLimit' | 'countTotal'>
  onCountChange: (event: MultipleOptionsEvent<TName>) => void
}

export function QuantitySelector<TName extends string>(
  props: QuantitySelectorProps<TName>
): React.JSX.Element {
  const { onCountChange, item, ctx } = props

  return (
    <div className="flex h-full items-center p-3 pl-0">
      <div className="flex items-center rounded-xs border border-zinc-300 bg-zinc-100 p-0.5 shadow-sm">
        <button
          type="button"
          className="rounded-xs px-2 py-1.5 text-red-500 active:bg-zinc-200"
          title="Remover"
          onClick={() => onCountChange({ type: 'REMOVE', option: item })}
        >
          {item.count === 1 ? (
            <Trash2 className="size-5 shrink-0" />
          ) : (
            <Minus className="size-5 shrink-0" />
          )}
        </button>
        <span className="px-2 py-1.5">{item.count}</span>
        <button
          type="button"
          className="rounded-xs px-2 py-1.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
          title="Adicionar"
          disabled={ctx.countTotal >= ctx.countLimit}
          onClick={() => onCountChange({ type: 'ADD', option: item })}
        >
          <Plus className="size-5 shrink-0" />
        </button>
      </div>
    </div>
  )
}
