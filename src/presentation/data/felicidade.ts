import type { Category, Product } from '../types'
import { slang } from './helpers'

export const felicidadeCategory: Category<
  Product,
  { size: { name: string; price: number }[] }
> = {
  path: 'felicidade',
  products: [
    {
      img: '/img/copo-da-felicidade-morango.avif',
      name: 'Copo da Felicidade de Morango',
      people: 1,
      price: 22,
    },
    {
      img: '/img/copo-da-felicidade-uva.avif',
      name: 'Copo da Felicidade de Uva',
      people: 1,
      price: 22,
    },
    {
      img: '/img/copo-da-felicidade-ouro-branco.avif',
      name: 'Copo da Felicidade de Ouro Branco',
      people: 1,
      price: 22,
    },
    {
      img: '/img/copo-da-felicidade-kinder-bueno.avif',
      name: 'Copo da Felicidade de Kinder Bueno',
      people: 1,
      price: 25,
    },
  ].map(p => ({ slang: slang(p.name), ...p })),
  size: [
    {
      name: 'Copo Pequeno',
      price: 0,
    },
    {
      name: 'Copo Médio',
      price: 3,
    },
  ],
}
