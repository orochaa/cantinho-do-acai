import type { Product } from '../types'

const products: Product[] = [
  {
    img: '/img/paleta.jpg',
    name: 'Paleta Italiana',
    people: 1,
    price: 10,
    quantity: 105,
    size: 'm',
    complements: 0,
    extras: 0,
  },
]

const flavors: string[] = [
  'Morango com Leite Condensado',
  'Açaí com Leite Condensado',
  'Chocolate com Leite Condensado',
  'Maracujá com Leite Condensado',
  'Ninho com Nutella',
]

export const paleta = {
  to: 'paleta',
  products,
  flavors,
}
