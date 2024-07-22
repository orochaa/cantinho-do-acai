import { useReducer } from 'react'

export interface Complement {
  name: string
  count: number
  price?: number
}

export interface ComplementState {
  countLimit: number
  countTotal: number
  complements: Complement[]
}

export interface ComplementEvent {
  type: 'ADD' | 'REMOVE'
  complement: Complement
}

export function complementsReducer(
  state: ComplementState,
  event: ComplementEvent
): ComplementState {
  if (event.type === 'ADD') {
    let countTotal = 0
    const result: Complement[] = []

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
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
  }

  return state
}

export function useComplements(
  complements: Omit<Complement, 'count'>[],
  countLimit: number
): [ComplementState, (event: ComplementEvent) => void] {
  return useReducer<typeof complementsReducer>(complementsReducer, {
    countTotal: 0,
    countLimit,
    complements: complements.map(c => ({ ...c, count: 0 })),
  })
}
