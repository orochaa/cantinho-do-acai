import type { Category, Product } from '../types'

export const paletaCategory: Category<Product, { flavors: string[] }> = {
  path: 'paleta',
  products: [
    {
      img: '/img/paleta.jpg',
      name: 'Paleta Italiana',
      price: 10,
      people: 1,
      quantity: 105,
    },
  ],
  flavors: [
    'Morango com Leite Condensado',
    'Açaí com Leite Condensado',
    'Chocolate com Leite Condensado',
    'Maracujá com Leite Condensado',
    'Ninho com Nutella',
  ],
}
