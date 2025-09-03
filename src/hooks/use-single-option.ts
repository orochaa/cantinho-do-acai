import { useReducer } from 'react'
import type { ActionDispatch } from 'react'

export type SelectableOption<TName extends string> = Option<TName> & {
  isSelected: boolean
}

export type InitialSelectableOption<TName extends string> = Optional<
  Omit<SelectableOption<TName>, 'count'>,
  'isSelected'
>

export interface SingleOptionState<TName extends string = string> {
  options: SelectableOption<TName>[]
  isSelected: boolean
}

const singleOptionReducer = <TName extends string>(
  state: SingleOptionState<TName>,
  selectedOption: SelectableOption<TName>
): SingleOptionState<TName> => {
  const options: SelectableOption<TName>[] = []
  let isAnyOptionSelected = false

  for (const option of state.options) {
    const isSelected = option.name === selectedOption.name

    isAnyOptionSelected ||= isSelected

    options.push({
      ...option,
      isSelected,
      count: isSelected ? 1 : 0,
    })
  }

  return {
    options,
    isSelected: isAnyOptionSelected,
  }
}

export function useSingleOption<TName extends string>(
  options: InitialSelectableOption<TName>[]
): [SingleOptionState<TName>, ActionDispatch<[SelectableOption<TName>]>] {
  return useReducer<SingleOptionState<TName>, [SelectableOption<TName>]>(
    singleOptionReducer,
    {
      isSelected: options.some(option => option.isSelected),
      options: options.map(
        option =>
          ({
            ...option,
            isSelected: !!option.isSelected,
            count: option.isSelected ? 1 : 0,
          }) as unknown as SelectableOption<TName>
      ),
    }
  )
}

export function isOptionSelected<TName extends string>(
  options: Option<TName>[],
  name: TName
): boolean {
  return !!options.find(o => o.name === name)?.count
}
