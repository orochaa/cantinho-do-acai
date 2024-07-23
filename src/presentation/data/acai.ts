import type { Category, Product } from '../types'

export type AcaiExtra =
  | 'KitKat'
  | 'Bis'
  | 'Amor Carioca'
  | 'Batom'
  | 'Bala de Goma'
  | 'Diamante Negro'
  | 'Laka'
  | 'Charge'
  | '5 Star'
  | 'Stikadinho'
  | 'Creme de Ninho'
  | 'Creme de Chocolate Branco'
  | 'Calda de Chocolate'
  | 'Calda de Morango'
  | "M&M's"
  | "Bib's"

export type Acai = Product & {
  complementsLimit: number
  complements: string[]
  extrasLimit: number
  extras: Record<AcaiExtra, number>
}

export const acaiCategory: Category<Acai> = {
  path: 'acai',
  products: [
    {
      img: '/img/kit-para-familia.jpeg',
      name: 'Kit para Família',
      people: 4,
      price: 45,
      quantity: 900,
      complementsLimit: 7,
      extrasLimit: 10,
      extras: {
        KitKat: 3.5,
        Bis: 3,
        'Amor Carioca': 3,
        Batom: 3,
        'Bala de Goma': 3,
        'Diamante Negro': 3,
        Laka: 3,
        Charge: 4,
        '5 Star': 4,
        Stikadinho: 3,
        'Creme de Ninho': 5.5,
        'Creme de Chocolate Branco': 5.5,
        'Calda de Chocolate': 3,
        'Calda de Morango': 3,
        "M&M's": 3,
        "Bib's": 4,
      },
    },
    {
      img: '/img/marmitex.jpeg',
      name: 'Marmitex do Cantinho',
      people: 3,
      price: 30,
      quantity: 800,
      complementsLimit: 5,
      extrasLimit: 10,
      extras: {
        KitKat: 3.5,
        Bis: 2.5,
        'Amor Carioca': 3,
        Batom: 3,
        'Bala de Goma': 2.5,
        'Diamante Negro': 3,
        Laka: 3,
        Charge: 3,
        '5 Star': 4,
        Stikadinho: 3,
        'Creme de Ninho': 5.5,
        'Creme de Chocolate Branco': 5.5,
        'Calda de Chocolate': 2.5,
        'Calda de Morango': 2.5,
        "M&M's": 3,
        "Bib's": 4,
      },
    },
    {
      img: '/img/copo-grande.avif',
      name: 'Copo de Açaí Grande',
      people: 1,
      price: 26,
      quantity: 770,
      complementsLimit: 5,
      extrasLimit: 10,
      extras: {
        KitKat: 3.5,
        Bis: 2.5,
        'Amor Carioca': 3,
        Batom: 3,
        'Bala de Goma': 2.5,
        'Diamante Negro': 3,
        Laka: 3,
        Charge: 3,
        '5 Star': 4,
        Stikadinho: 3,
        'Creme de Ninho': 5.5,
        'Creme de Chocolate Branco': 5.5,
        'Calda de Chocolate': 2.5,
        'Calda de Morango': 2.5,
        "M&M's": 3,
        "Bib's": 4,
      },
    },
    {
      img: '/img/copo-medio.jpeg',
      name: 'Copo de Açaí Médio',
      people: 1,
      price: 17,
      quantity: 440,
      complementsLimit: 3,
      extrasLimit: 10,
      extras: {
        KitKat: 2.5,
        Bis: 2,
        'Amor Carioca': 2,
        Batom: 2,
        'Bala de Goma': 2,
        'Diamante Negro': 2,
        Laka: 2,
        Charge: 3,
        '5 Star': 3,
        Stikadinho: 2,
        'Creme de Ninho': 4.5,
        'Creme de Chocolate Branco': 4.5,
        'Calda de Chocolate': 2,
        'Calda de Morango': 2,
        "M&M's": 2,
        "Bib's": 3,
      },
    },
    {
      img: '/img/copo-pequeno.jpeg',
      name: 'Copo de Açaí Pequeno',
      people: 1,
      price: 12,
      quantity: 250,
      complementsLimit: 3,
      extrasLimit: 5,
      extras: {
        KitKat: 2,
        Bis: 1.5,
        'Amor Carioca': 2,
        Batom: 2,
        'Bala de Goma': 1,
        'Diamante Negro': 2,
        Laka: 1.5,
        Charge: 1.5,
        '5 Star': 3,
        Stikadinho: 2,
        'Creme de Ninho': 4.5,
        'Creme de Chocolate Branco': 4.5,
        'Calda de Chocolate': 1.5,
        'Calda de Morango': 1.5,
        "M&M's": 2,
        "Bib's": 3,
      },
    },
  ].map(p => ({
    complements: [
      'Banana',
      'Granola',
      'Leite Condensado',
      'Leite Ninho',
      'Morango',
      'Ovomaltine',
      'Paçoca',
      'Sucrilhos',
    ],
    ...p,
  })),
}
