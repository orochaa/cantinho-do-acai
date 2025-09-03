import { useMemo } from 'react'

export function useTotal(initialPrice: number, options: Option[]): number {
  return useMemo(() => {
    let result = initialPrice

    for (const option of options) {
      if (!option.price || !option.count) {
        continue
      }
      result += option.price * option.count
    }

    return result
  }, [options, initialPrice])
}
