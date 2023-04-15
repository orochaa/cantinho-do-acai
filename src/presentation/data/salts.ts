import { Product } from '../types'

const products: Product[] = [
  {
    img: '/img/copo-pequeno.jpeg',
    name: 'Salgados Pequeno + Molho + Mini Coca', // + Molhos
    people: 1,
    price: 20,
    quantity: 300, // salgados
    size: 'p',
    complements: 15,
    extras: 0
  },
  {
    img: '/img/copo-pequeno.jpeg',
    name: 'Salgados Médio + Molho',
    people: 2,
    price: 35,
    quantity: 500,
    size: 'm',
    complements: 25,
    extras: 0
  }
]

const complements: string[] = [
  'Bolinha de Queijo',
  'Coxinha de Frango',
  'Enroladinho de Salsicha',
  'Churros de Doce de Leite'
]

const sauces: string[] = ['Cheddar', 'Catupiri']

export const salts = {
  to: 'salgados',
  products,
  complements,
  sauces
}
