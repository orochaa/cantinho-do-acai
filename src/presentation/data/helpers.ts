/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from '@brazilian-utils/brazilian-utils'

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
