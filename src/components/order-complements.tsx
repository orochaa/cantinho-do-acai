/* eslint-disable react/no-multi-comp */
import type { ComplementEvent, ComplementState } from '@/hooks/use-complements'
import { formatCurrency } from '@/lib/format'
import { Minus, Plus, Trash2 } from 'lucide-react'
import { Container } from './container'

export interface OrderComplementsProps<TComplementName extends string> {
  title: string
  ctx: ComplementState<TComplementName>
  addComplementEvent: (event: ComplementEvent<TComplementName>) => void
}

export function OrderComplements<TComplementName extends string>(
  props: OrderComplementsProps<TComplementName>
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
          className="flex rounded-sm bg-zinc-100 active:bg-zinc-200"
        >
          <button
            type="button"
            className="flex h-[3.5rem] grow flex-col p-3 md:flex-row md:items-center md:justify-between"
            onClick={() =>
              addComplementEvent({
                type: ctx.countLimit === 1 ? 'SELECT' : 'ADD',
                complement,
              })
            }
          >
            <p className="text-left text-base md:text-lg">{complement.name}</p>
            {!!complement.price && (
              <span className="text-left text-[0.8rem] tracking-tight md:text-base">
                + {formatCurrency(complement.price)}
              </span>
            )}
          </button>

          <div className="h-[3.5rem]">
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
        </div>
      ))}
    </Container>
  )
}

interface MultiComponentsContainerProps<TComplementName extends string> {
  complement: Complement<TComplementName>
  ctx: ComplementState<TComplementName>
  addComplementEvent: (event: ComplementEvent<TComplementName>) => void
}

export function MultiComponentsContainer<TComplementName extends string>(
  props: MultiComponentsContainerProps<TComplementName>
): React.JSX.Element {
  const { addComplementEvent, complement, ctx } = props

  return (
    <div className="flex h-full items-center p-3 pl-0">
      <div className="flex items-center rounded-xs border border-zinc-300 bg-zinc-100 p-0.5 shadow-sm">
        <button
          type="button"
          className="rounded-xs px-2 py-1.5 text-red-500 active:bg-zinc-200"
          title="Remover"
          onClick={() => addComplementEvent({ type: 'REMOVE', complement })}
        >
          {complement.count === 1 ? (
            <Trash2 className="size-5 shrink-0" />
          ) : (
            <Minus className="size-5 shrink-0" />
          )}
        </button>
        <span className="px-2 py-1.5">{complement.count}</span>
        <button
          type="button"
          className="rounded-xs px-2 py-1.5 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
          title="Adicionar"
          disabled={ctx.countTotal >= ctx.countLimit}
          onClick={() => addComplementEvent({ type: 'ADD', complement })}
        >
          <Plus className="size-5 shrink-0" />
        </button>
      </div>
    </div>
  )
}

interface AddComplementButtonProps<TComplementName extends string> {
  complement: Complement<TComplementName>
  ctx: ComplementState<TComplementName>
  addComplementEvent: (event: ComplementEvent<TComplementName>) => void
}

function AddComplementButton<TComplementName extends string>(
  props: AddComplementButtonProps<TComplementName>
): React.JSX.Element {
  const { addComplementEvent, complement, ctx } = props

  return (
    <button
      type="button"
      className="flex h-full items-center justify-center rounded-xs p-3 pl-0 text-red-500 active:bg-zinc-200 disabled:text-zinc-500"
      title="Adicionar"
      disabled={ctx.countTotal >= ctx.countLimit}
      onClick={() => addComplementEvent({ type: 'ADD', complement })}
    >
      <Plus className="size-5" />
    </button>
  )
}

interface ToggleComplementButtonProps<TComplementName extends string> {
  complement: Complement<TComplementName>
  addComplementEvent: (event: ComplementEvent<TComplementName>) => void
}

function ToggleComplementButton<TComplementName extends string>(
  props: ToggleComplementButtonProps<TComplementName>
): React.JSX.Element {
  const { addComplementEvent, complement } = props

  return (
    <button
      type="button"
      title="Selecionar"
      className="flex h-full items-center justify-center p-3 pl-0"
      disabled={complement.count === 1}
      onClick={() => addComplementEvent({ type: 'SELECT', complement })}
    >
      <span
        data-disabled={complement.count === 1}
        className="block size-6 rounded-full bg-zinc-200 ring-2 ring-red-500 ring-offset-2 active:bg-red-300 data-[disabled=true]:bg-red-500"
      />
    </button>
  )
}
