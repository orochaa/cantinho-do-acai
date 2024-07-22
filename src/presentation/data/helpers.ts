/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from '@brazilian-utils/brazilian-utils'
import type { ClassValue } from 'clsx'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

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

export function cn(...className: ClassValue[]): string {
  return twMerge(clsx(...className))
}
