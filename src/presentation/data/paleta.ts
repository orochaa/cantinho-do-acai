import type { Category, Product } from '../types'

export const paletaCategory: Category<
  Product,
  { flavors: { name: string; price: number }[] }
> = {
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
    { name: 'Morango com Leite Condensado', price: 10 },
    { name: 'Açaí com Leite Condensado', price: 10 },
    { name: 'Chocolate com Leite Condensado', price: 10 },
    { name: 'Maracujá com Leite Condensado', price: 10 },
    { name: 'Ninho com Nutella', price: 10 },
  ],
}
