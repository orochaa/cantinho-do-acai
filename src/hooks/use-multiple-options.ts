import { useReducer } from 'react'
import type { ActionDispatch } from 'react'

export interface MultipleOptionsState<TName extends string = string> {
  options: Option<TName>[]
  countLimit: number
  countTotal: number
}

export interface MultipleOptionsEvent<TName extends string = string> {
  type: 'ADD' | 'REMOVE'
  option: Option<TName>
}

function multipleOptionsReducer<TName extends string = string>(
  state: MultipleOptionsState<TName>,
  event: MultipleOptionsEvent<TName>
): MultipleOptionsState<TName> {
  switch (event.type) {
    case 'ADD': {
      let countTotal = 0
      const result: Option<TName>[] = []

      for (const option of state.options) {
        if (option.name === event.option.name) {
          const newCount = event.option.count + 1
          countTotal += newCount
          result.push({ ...option, count: newCount })

          continue
        }

        countTotal += option.count
        result.push(option)
      }

      if (countTotal <= state.countLimit) {
        return {
          countLimit: state.countLimit,
          countTotal,
          options: result,
        }
      }

      return state
    }

    case 'REMOVE':
      if (event.option.count === 0) {
        return state
      }

      return {
        countLimit: state.countLimit,
        countTotal: state.countTotal - 1,
        options: state.options.map(option => {
          return option.name === event.option.name
            ? { ...option, count: event.option.count - 1 }
            : option
        }),
      }

    default:
      return state
  }
}

export function useMultipleOptions<TName extends string>(
  options: Optional<Option<TName>, 'count'>[],
  countLimit: number
): [
  MultipleOptionsState,
  ActionDispatch<[event: MultipleOptionsEvent<TName>]>,
] {
  const [state, dispatch] = useReducer(multipleOptionsReducer<TName>, {
    countTotal: 0,
    countLimit,
    options: options.map(
      option => ({ count: 0, ...option }) as unknown as Option<TName>
    ),
  })

  return [state, dispatch] as const
}
