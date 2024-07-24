import type { Category, Product } from '../types'
import { slang } from './helpers'

export type Salgado = Product & {
  complementsLimit: number
  complements: string[]
  saucesLimit: number
  sauces: string[]
}

export const salgadosCategory: Category<Salgado> = {
  path: 'salgados',
  products: [
    {
      img: '/img/salgados-pequeno.jpeg',
      name: 'Kit Salgados Pequeno + Mini Coca',
      people: 1,
      price: 20,
      quantity: 300,
      complementsLimit: 15,
      saucesLimit: 1,
    },
    {
      img: '/img/salgados-medio.jpeg',
      name: 'Kit Salgados Médio',
      people: 2,
      price: 35,
      quantity: 500,
      complementsLimit: 5,
      saucesLimit: 2,
    },
  ].map(p => ({
    slang: slang(p.name),
    complements: [
      'Churros de Doce de Leite',
      'Croquete',
      'Coxinha de Frango',
      'Almofadinha de Presunto e Queijo',
      'Risoles de Carne',
      'Risoles de Frango',
      'Bolinha de Queijo',
      'Enroladinho de Salsicha',
    ],
    sauces: ['Molho Cheddar', 'Molho de Catupiri'],
    ...p,
  })),
}
