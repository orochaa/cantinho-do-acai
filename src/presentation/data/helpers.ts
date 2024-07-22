/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from '@brazilian-utils/brazilian-utils'
import type { ComplementEvent, ComplementState } from '../types'

export function slang(data: string): string {
  return encodeURI(data.toLowerCase().replaceAll(/\s/g, '-'))
}

export function parseSlang(slang: string): string {
  return decodeURI(
    slang
      .split('-')
      .map(w => capitalize(w))
      .join(' ')
  )
}

export const complementReducer = (
  state: ComplementState[],
  event: ComplementEvent
): ComplementState[] => {
  return state.map(complement => {
    const calc = (field: 'count' | 'total'): number => {
      const result = complement[field] + (event.type === 'ADD' ? 1 : -1)

      return complement.total < complement.max
        ? result > 0
          ? result < complement.max
            ? result
            : complement.max
          : 0
        : event.type === 'REMOVE'
          ? result
          : complement[field]
    }
    const total = calc('total')

    if (complement.name === event.complement) {
      return {
        name: complement.name,
        count: calc('count'),
        max: complement.max,
        price: complement.price,
        total,
      }
    }

    return {
      ...complement,
      total,
    }
  })
}
