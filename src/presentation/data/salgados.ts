import type { Product } from '../types'

const products: Product[] = [
  {
    img: '/img/salgados-pequeno.jpeg',
    name: 'Kit Salgados Pequeno + Mini Coca',
    people: 1,
    price: 20,
    quantity: 300,
    size: 'p',
    complements: 15,
    extras: 0,
  },
  {
    img: '/img/salgados-medio.jpeg',
    name: 'Kit Salgados Médio',
    people: 2,
    price: 35,
    quantity: 500,
    size: 'm',
    complements: 5,
    extras: 0,
  },
]

const complements: string[] = [
  'Churros de Doce de Leite',
  'Croquete',
  'Coxinha de Frango',
  'Almofadinha de Presunto e Queijo',
  'Risoles de Carne',
  'Risoles de Frango',
  'Bolinha de Queijo',
  'Enroladinho de Salsicha',
]

const sauces: string[] = ['Cheddar', 'Catupiri']

export const salgados = {
  to: 'salgados',
  products,
  complements,
  sauces,
}
