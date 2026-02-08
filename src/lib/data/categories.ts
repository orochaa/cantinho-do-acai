import { bebidaCategory } from '@/lib/data/bebida'
import { geladinhoCategory } from '@/lib/data/geladinho'
import { paletaCategory } from '@/lib/data/paleta'
import { entries } from 'remeda'
import { acaiCategory } from './acai'
import { felicidadeCategory } from './felicidade'
// import { paletaCategory } from './paleta'
import { premiumCategory } from './premium'
import { salgadosCategory } from './salgados'

export const categories = {
  Açaí: acaiCategory,
  Premium: premiumCategory,
  Paletas: paletaCategory,
  'Copos da Felicidade': felicidadeCategory,
  'Geladinho Gourmet': geladinhoCategory,
  Salgados: salgadosCategory,
  Bebidas: bebidaCategory,
} satisfies Record<string, Category>

export const categoriesList = entries(categories)
  .map(([name, data]) => ({
    ...data,
    name,
    products: data.products.filter(({ disabled }) => !disabled),
  }))
  .filter(({ disabled }) => !disabled)
