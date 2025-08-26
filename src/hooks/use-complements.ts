import { useReducer } from 'react'

export interface ComplementState<TName extends string = string> {
  countLimit: number
  countTotal: number
  complements: Complement<TName>[]
}

export interface ComplementEvent<TName extends string = string> {
  type: 'ADD' | 'REMOVE' | 'SELECT'
  complement: Complement<TName>
}

export function complementsReducer<TName extends string = string>(
  state: ComplementState<TName>,
  event: ComplementEvent<TName>
): ComplementState<TName> {
  if (event.type === 'ADD') {
    let countTotal = 0
    const result: Complement<TName>[] = []

    for (const complement of state.complements) {
      if (complement.name === event.complement.name) {
        const newCount = event.complement.count + 1
        countTotal += newCount
        result.push({ ...complement, count: newCount })
      } else {
        countTotal += complement.count
        result.push(complement)
      }
    }

    if (countTotal <= state.countLimit) {
      return {
        countLimit: state.countLimit,
        countTotal,
        complements: result,
      }
    }
  } else if (event.type === 'REMOVE' && event.complement.count > 0) {
    return {
      countLimit: state.countLimit,
      countTotal: state.countTotal - 1,
      complements: state.complements.map(complement => {
        return complement.name === event.complement.name
          ? { ...complement, count: event.complement.count - 1 }
          : complement
      }),
    }
  } else if (event.type === 'SELECT' && state.countLimit === 1) {
    return {
      countLimit: state.countLimit,
      countTotal: 1,
      complements: state.complements.map(complement => {
        return {
          ...complement,
          count: complement.name === event.complement.name ? 1 : 0,
        }
      }),
    }
  }

  return state
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/explicit-module-boundary-types
export function useComplements<TName extends string>(
  complements: Optional<Complement<TName>, 'count'>[],
  countLimit: number
) {
  const [complementsState, addComplementEvent] = useReducer<
    ComplementState<TName>,
    [ComplementEvent<TName>]
  >(complementsReducer, {
    countTotal: 0,
    countLimit,
    complements: complements.map(
      c => ({ count: 0, ...c }) as unknown as Complement<TName>
    ),
  })

  return [complementsState, addComplementEvent] as const
}

export function isComplementSelected<TName extends string>(
  complementsState: ComplementState<TName>,
  name: NoInfer<TName>
): boolean {
  const complement = complementsState.complements.find(c => c.name === name)

  return !!complement && complement.count > 0
}
