import type { Category } from '../types'
import { acaiCategory } from './acai'
import { felicidadeCategory } from './felicidade'
import { paletaCategory } from './paleta'
import { salgadosCategory } from './salgados'

export const categories = {
  Açaí: acaiCategory,
  Paletas: paletaCategory,
  Salgados: salgadosCategory,
  'Copos da Felicidade': felicidadeCategory,
} satisfies Record<string, Category>
