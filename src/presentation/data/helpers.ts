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

type ObjectEntries<T extends Record<string, any>> = UnionToTuple<
  {
    [K in keyof T]-?: [K, T[K] extends infer U | undefined ? U : T[K]]
  }[keyof T]
>

export function objectEntries<TObj extends object>(
  obj: TObj
): ObjectEntries<TObj> {
  return Object.entries(obj) as ObjectEntries<TObj>
}

export function objectKeys<TObj extends object>(obj: TObj): (keyof TObj)[] {
  return Object.keys(obj) as (keyof TObj)[]
}

export function objectValues<TObj extends object>(
  obj: TObj
): TObj[keyof TObj][] {
  return Object.values(obj) as TObj[keyof TObj][]
}

type MergeObjects<T, K = T> = T extends [infer F, ...infer R]
  ? F & MergeObjects<R, F>
  : K

export function mergeObjects<T extends Record<string, unknown>[]>(
  ...data: T
): MergeObjects<T> {
  const result = data.shift() as T[0]

  for (const [key, value] of data.flatMap(obj =>
    objectEntries<Record<string, any>>(obj)
  )) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    result[key as keyof T[0]] = value
  }

  return result as MergeObjects<T>
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
