import { Product } from '../types'

const products: Product[] = [
  {
    img: '/img/copo-pequeno.jpeg',
    name: 'Cachorro Quente de Salsicha + Mini Coca',
    people: 1,
    price: 15,
    quantity: 500,
    size: 'm',
    complements: 0,
    extras: 0
  },
  {
    img: '/img/copo-pequeno.jpeg',
    name: 'Cachorro Quente de Calabresa + Mini Coca',
    people: 1,
    price: 15,
    quantity: 500,
    size: 'm',
    complements: 0,
    extras: 0
  }
]

const complements: string[] = [
  'Molho',
  'Milho',
  'Ervilha',
  'Maionese',
  'Katchup',
  'Mostarda',
  'Batata Palha'
]

export const hotdog = {
  to: 'hotdog',
  products,
  complements
}
