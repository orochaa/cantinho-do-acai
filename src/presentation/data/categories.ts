import type { Category } from '../types'
import { acaiCategory } from './acai'
import { paletaCategory } from './paleta'
import { salgadosCategory } from './salgados'

export const categories = {
  Açaí: acaiCategory,
  Paletas: paletaCategory,
  Salgados: salgadosCategory,
} satisfies Record<string, Category>
