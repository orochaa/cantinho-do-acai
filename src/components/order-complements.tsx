/* eslint-disable react/no-multi-comp */
import type { ComplementEvent, ComplementState } from '@/hooks/use-complements'
import { cn, formatCurrency } from '@/lib/format'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Container } from './container'

export interface OrderComplementsProps {
  title: string
  ctx: ComplementState
  addComplementEvent: (event: ComplementEvent) => void
}

export function OrderComplements(
  props: OrderComplementsProps
): React.JSX.Element {
  const { title, ctx, addComplementEvent } = props

  return (
    <Container>
      <div className="m-1 text-white">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">
          {ctx.countLimit > 1
            ? `Escolha até ${ctx.countLimit} opções`
            : 'Escolha uma opção'}
        </p>
      </div>

      {ctx.complements.map(complement => (
        <div
          key={complement.name}
          className="flex items-center gap-3.5 rounded-sm bg-zinc-100 p-2 active:bg-zinc-200"
        >
          <button
            type="button"
            className="flex grow flex-col md:flex-row md:items-center md:justify-between"
            onClick={() =>
              addComplementEvent({
                type: ctx.countLimit === 1 ? 'SELECT' : 'ADD',
                complement,
              })
            }
          >
            <p className="text-base md:text-lg">{complement.name}</p>
            {!!complement.price && (
              <span className="text-[0.8rem] tracking-tight md:text-base">
                + {formatCurrency(complement.price)}
              </span>
            )}
          </button>

          {ctx.countLimit === 1 ? (
            <ToggleComplementButton
              addComplementEvent={addComplementEvent}
              complement={complement}
            />
          ) : complement.count === 0 ? (
            <AddComplementButton
              addComplementEvent={addComplementEvent}
              complement={complement}
              ctx={ctx}
            />
          ) : (
            <MultiComponentsContainer
              addComplementEvent={addComplementEvent}
              complement={complement}
              ctx={ctx}
            />
          )}
        </div>
      ))}
    </Container>
  )
}

interface MultiComponentsContainerProps {
  complement: Complement
  ctx: ComplementState
  addComplementEvent: (event: ComplementEvent) => void
  containerClassName?: string
}

export function MultiComponentsContainer(
  props: MultiComponentsContainerProps
): React.JSX.Element {
  const { addComplementEvent, complement, ctx, containerClassName } = props

  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-xs border border-zinc-300 bg-zinc-100 p-1.5 shadow-sm',
        containerClassName
      )}
    >
      <button
        type="button"
        className="rounded-xs p-0.5 text-red-500 active:bg-zinc-200"
        title="Remover"
        onClick={() => addComplementEvent({ type: 'REMOVE', complement })}
      >
        {complement.count === 1 ? (
          <Trash2 className="size-5 shrink-0" />
        ) : (
          <Minus className="size-5 shrink-0" />
        )}
      </button>
      <span>{complement.count}</span>
      <button
        type="button"
        className="rounded-xs p-0.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
        title="Adicionar"
        disabled={ctx.countTotal >= ctx.countLimit}
        onClick={() => addComplementEvent({ type: 'ADD', complement })}
      >
        <Plus className="size-5 shrink-0" />
      </button>
    </div>
  )
}

interface AddComplementButtonProps {
  complement: Complement
  ctx: ComplementState
  addComplementEvent: (event: ComplementEvent) => void
}

function AddComplementButton(
  props: AddComplementButtonProps
): React.JSX.Element {
  const { addComplementEvent, complement, ctx } = props

  return (
    <button
      type="button"
      className="block h-[2.4rem] rounded-xs p-0.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
      title="Adicionar"
      disabled={ctx.countTotal >= ctx.countLimit}
      onClick={() => addComplementEvent({ type: 'ADD', complement })}
    >
      <Plus className="size-5" />
    </button>
  )
}

interface ToggleComplementButtonProps {
  complement: Complement
  addComplementEvent: (event: ComplementEvent) => void
}

function ToggleComplementButton(
  props: ToggleComplementButtonProps
): React.JSX.Element {
  const { addComplementEvent, complement } = props

  return (
    <button
      type="button"
      className="block size-6 rounded-full bg-zinc-200 ring-2 ring-red-500 ring-offset-2 active:bg-red-300 disabled:bg-red-500"
      title="Selecionar"
      disabled={complement.count === 1}
      onClick={() => addComplementEvent({ type: 'SELECT', complement })}
    />
  )
}
