import { Category } from '../types'
import { acai } from './acai'
import { hotdog } from './hotdog'
import { paleta } from './paleta'
import { salts } from './salts'

export const categories: Record<string, Category> = {
  Acaí: acai,
  Paletas: paleta,
  Salgados: salts,
  'Cachorro Quente': hotdog
}
