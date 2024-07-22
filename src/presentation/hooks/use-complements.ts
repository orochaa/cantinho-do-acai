import { useReducer } from 'react'

export interface Complement {
  name: string
  count: number
  countLimit: number
  price?: number
}

export interface ComplementEvent {
  type: 'ADD' | 'REMOVE'
  complement: Complement
}

export function complementsReducer(
  state: Complement[],
  event: ComplementEvent
): Complement[] {
  if (event.type === 'ADD') {
    let totalCount = 0
    const result: Complement[] = []

    for (const complement of state) {
      if (complement.name === event.complement.name) {
        totalCount += event.complement.count + 1
        result.push({ ...complement, count: event.complement.count + 1 })
      } else {
        totalCount += complement.count
        result.push(complement)
      }
    }

    if (totalCount > event.complement.countLimit) {
      return state
    }

    return result
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  } else if (event.type === 'REMOVE' && event.complement.count > 0) {
    return state.map(complement => {
      return complement.name === event.complement.name
        ? { ...complement, count: event.complement.count - 1 }
        : complement
    })
  }

  return state
}

export function useComplements(
  initialState: Omit<Complement, 'count'>[]
): [Complement[], (event: ComplementEvent) => void] {
  return useReducer<typeof complementsReducer>(
    complementsReducer,
    initialState.map(complement => ({ ...complement, count: 0 }))
  )
}
