import { Category } from '../types'
import { acai } from './acai'
import { hotdog } from './hotdog'
import { paleta } from './paleta'
import { salgados } from './salgados'

export const categories: Record<string, Category> = {
  Acaí: acai,
  Paletas: paleta,
  Salgados: salgados,
  'Cachorro Quente': hotdog
}
