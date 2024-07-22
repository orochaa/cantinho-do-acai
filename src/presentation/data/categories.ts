import type { Category } from '../types'
import { acai } from './acai'
import { paleta } from './paleta'
import { salgados } from './salgados'

export const categories: Record<string, Category> = {
  Acaí: acai,
  Paletas: paleta,
  Salgados: salgados,
}
