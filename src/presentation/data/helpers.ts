import { capitalize } from '@brazilian-utils/brazilian-utils'
import { ComplementEvent, ComplementState } from '../types'

export function slang(data: string): string {
  return encodeURI(data.toLowerCase().replace(/\s/g, '-'))
}

export function parseSlang(slang: string): string {
  return slang
    .split('-')
    .map(w => capitalize(w))
    .join(' ')
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

export function objectKeys<TObj extends object>(obj: TObj): Array<keyof TObj> {
  return Object.keys(obj) as Array<keyof TObj>
}

export function objectValues<TObj extends object>(
  obj: TObj
): Array<TObj[keyof TObj]> {
  return Object.values(obj) as Array<TObj[keyof TObj]>
}

type MergeObjects<T, K = T> = T extends [infer F, ...infer R]
  ? F & MergeObjects<R, F>
  : K

export function mergeObjects<T extends Record<string, unknown>[]>(
  ...data: T
): MergeObjects<T> {
  const result = data.shift() as T[0]
  data
    .map(obj => objectEntries<Record<string, any>>(obj))
    .flat()
    .forEach(([key, value]) => {
      result[key as keyof T[0]] = value
    })
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
        total
      }
    }
    return {
      ...complement,
      total
    }
  })
}
