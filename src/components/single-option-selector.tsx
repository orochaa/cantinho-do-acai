/* eslint-disable react/no-multi-comp */
import type {
  SelectableOption,
  SingleOptionState,
} from '@/hooks/use-single-option'
import { formatCurrency } from '@/lib/format'
import type { ActionDispatch } from 'react'
import { Container } from './container'

export interface SingleOptionSelectorProps<TName extends string> {
  title: string
  ctx: SingleOptionState<TName>
  onSelectionChange: ActionDispatch<[SelectableOption<TName>]>
}

export function SingleOptionSelector<TName extends string>(
  props: SingleOptionSelectorProps<TName>
): React.JSX.Element {
  const { title, ctx, onSelectionChange } = props

  return (
    <Container>
      <div className="m-1 text-white">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">Escolha uma opção</p>
      </div>

      {ctx.options.map(option => (
        <div
          key={option.name}
          className="flex rounded-sm bg-zinc-100 active:bg-zinc-200"
        >
          <button
            type="button"
            className="flex h-[3.5rem] grow flex-col justify-center p-3 md:flex-row md:items-center md:justify-between"
            onClick={() => onSelectionChange(option)}
          >
            <p className="text-left text-base md:text-lg">{option.name}</p>
            {!!option.price && (
              <span className="text-left text-[0.8rem] tracking-tight md:text-base">
                + {formatCurrency(option.price)}
              </span>
            )}
          </button>

          <div className="h-[3.5rem]">
            <ToggleOptionButton
              onSelectionChange={onSelectionChange}
              option={option}
            />
          </div>
        </div>
      ))}
    </Container>
  )
}

interface ToggleOptionButtonProps<TName extends string> {
  option: SelectableOption<TName>
  onSelectionChange: (option: SelectableOption<TName>) => void
}

function ToggleOptionButton<TName extends string>(
  props: ToggleOptionButtonProps<TName>
): React.JSX.Element {
  const { option, onSelectionChange } = props

  return (
    <button
      type="button"
      title="Selecionar"
      className="flex h-full items-center justify-center p-3 pl-0"
      disabled={option.isSelected}
      onClick={() => onSelectionChange(option)}
    >
      <span
        data-disabled={option.isSelected}
        className="block size-6 rounded-full bg-zinc-200 ring-2 ring-red-500 ring-offset-2 active:bg-red-300 data-[disabled=true]:bg-red-500"
      />
    </button>
  )
}
