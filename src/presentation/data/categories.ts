import { acaiCategory } from './acai'
import { felicidadeCategory } from './felicidade'
// import { paletaCategory } from './paleta'
import { premiumCategory } from './premium'
import { salgadosCategory } from './salgados'

export const categories = {
  Premium: premiumCategory,
  Açaí: acaiCategory,
  // Paletas: paletaCategory,
  'Copos da Felicidade': felicidadeCategory,
  Salgados: salgadosCategory,
} satisfies Record<string, Category>
