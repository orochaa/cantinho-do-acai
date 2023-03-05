import { capitalize } from '@brazilian-utils/brazilian-utils'

export function slang(data: string): string {
  return data.toLowerCase().replace(/\s/g, '-')
}

export function parseSlang(slang: string): string {
  return slang
    .split('-')
    .map(w => capitalize(w))
    .join(' ')
}
