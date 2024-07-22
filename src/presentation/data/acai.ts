import type { Product, Size } from '../types'

const products: Product[] = [
  {
    img: '/img/kit-para-familia.jpeg',
    name: 'Kit para Família',
    people: 4,
    price: 45,
    quantity: 1000,
    size: 'gg',
    complements: 7,
    extras: 10,
  },
  {
    img: '/img/marmitex.jpeg',
    name: 'Marmitex do Cantinho',
    people: 3,
    price: 30,
    quantity: 900,
    size: 'g',
    complements: 5,
    extras: 10,
  },
  {
    img: '/img/copo-grande.jpeg',
    name: 'Copo de Açaí Grande',
    people: 1,
    price: 26,
    quantity: 770,
    size: 'g',
    complements: 5,
    extras: 10,
  },
  {
    img: '/img/copo-medio.jpeg',
    name: 'Copo de Açaí Médio',
    people: 1,
    price: 17,
    quantity: 440,
    size: 'm',
    complements: 3,
    extras: 10,
  },
  {
    img: '/img/copo-pequeno.jpeg',
    name: 'Copo de Açaí Pequeno',
    people: 1,
    price: 12,
    quantity: 250,
    size: 'p',
    complements: 3,
    extras: 5,
  },
]

const complements: string[] = [
  'Banana',
  'Granola',
  'Leite Condensado',
  'Leite Ninho',
  'Morango',
  'Ovomaltine',
  'Paçoca',
  'Sucrilhos',
]

const extras: Record<string, Record<Size, number>> = {
  'Kit Kat': {
    gg: 3.5,
    g: 3.5,
    m: 2.5,
    p: 2,
  },
  Bis: {
    gg: 3,
    g: 2.5,
    m: 2,
    p: 1.5,
  },
  'Amor Carioca': {
    gg: 3,
    g: 3,
    m: 2,
    p: 2,
  },
  Batom: {
    gg: 3,
    g: 3,
    m: 2,
    p: 2,
  },
  'Bala de Goma': {
    gg: 3,
    g: 2.5,
    m: 2,
    p: 1,
  },
  'Diamante Negro': {
    gg: 3,
    g: 3,
    m: 2,
    p: 2,
  },
  Laka: {
    gg: 3,
    g: 3,
    m: 2,
    p: 1.5,
  },
  Charge: {
    gg: 4,
    g: 3,
    m: 3,
    p: 1.5,
  },
  '5 Star': {
    gg: 4,
    g: 4,
    m: 3,
    p: 3,
  },
  Stikadinho: {
    gg: 3,
    g: 3,
    m: 2,
    p: 2,
  },
  'Creme de Ninho': {
    gg: 5.5,
    g: 5.5,
    m: 4.5,
    p: 4.5,
  },
  'Creme de Chocolate Branco': {
    gg: 5.5,
    g: 5.5,
    m: 4.5,
    p: 4.5,
  },
  'Calda de Chocolate': {
    gg: 3,
    g: 2.5,
    m: 2,
    p: 1.5,
  },
  'Calda de Morango': {
    gg: 3,
    g: 2.5,
    m: 2,
    p: 1.5,
  },
  "M&M's": {
    gg: 3,
    g: 3,
    m: 2,
    p: 2,
  },
  "Bib's": {
    gg: 4,
    g: 4,
    m: 3,
    p: 3,
  },
}

export const acai = {
  to: 'acai',
  products,
  complements,
  extras,
}
