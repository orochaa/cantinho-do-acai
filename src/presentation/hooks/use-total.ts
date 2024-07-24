import { useMemo } from 'react'
import type { Complement } from '../types'

export function useTotal(
  initialPrice: number,
  ...complements: Complement[]
): number {
  return useMemo(() => {
    let result = initialPrice

    for (const complement of complements) {
      if (!complement.price || !complement.count) {
        continue
      }
      result += complement.price * complement.count
    }

    return result
  }, [complements, initialPrice])
}
