import { bebidaCategory } from '@/lib/data/bebida'
import { acaiCategory } from './acai'
import { felicidadeCategory } from './felicidade'
import { geladinhoCategory } from './geladinho'
// import { paletaCategory } from './paleta'
import { premiumCategory } from './premium'
import { salgadosCategory } from './salgados'

export const categories = {
  Premium: premiumCategory,
  Açaí: acaiCategory,
  // Paletas: paletaCategory,
  'Copos da Felicidade': felicidadeCategory,
  'Geladinho Gourmet': geladinhoCategory,
  Salgados: salgadosCategory,
  Bebidas: bebidaCategory,
} satisfies Record<string, Category>
