import { useReducer } from 'react'

export interface ComplementState {
  countLimit: number
  countTotal: number
  complements: Complement[]
}

export interface ComplementEvent {
  type: 'ADD' | 'REMOVE' | 'SELECT'
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

export function useComplements(
  complements: Optional<Complement, 'count'>[],
  countLimit: number
): [ComplementState, (event: ComplementEvent) => void] {
  return useReducer<typeof complementsReducer>(complementsReducer, {
    countTotal: 0,
    countLimit,
    complements: complements.map(c => ({ count: 0, ...c })),
  })
}
