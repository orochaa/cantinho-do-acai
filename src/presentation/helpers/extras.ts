import { Size } from './product'

export type Extra = Record<string, Record<Size, number>>

export const extras: Extra = {
  'Kit Kat': {
    gg: 3.5,
    g: 3.5,
    m: 2.5,
    p: 2
  },
  'Bis': {
    gg: 3,
    g: 2.5,
    m: 2,
    p: 1.5
  },
  'Amor Carioca': {
    gg: 3,
    g: 3,
    m: 2,
    p: 2
  },
  'Batom': {
    gg: 3,
    g: 3,
    m: 2,
    p: 2
  },
  'Bala de Goma': {
    gg: 3,
    g: 2.5,
    m: 2,
    p: 1
  },
  'Diamante Negro': {
    gg: 3,
    g: 3,
    m: 2,
    p: 2
  },
  'Laka': {
    gg: 3,
    g: 3,
    m: 2,
    p: 1.5
  },
  'Charge': {
    gg: 4,
    g: 3,
    m: 3,
    p: 1.5
  },
  '5 Star': {
    gg: 4,
    g: 4,
    m: 3,
    p: 3
  },
  'Stikadinho': {
    gg: 3,
    g: 3,
    m: 2,
    p: 2
  },
  'Creme de Ninho': {
    gg: 5.5,
    g: 5.5,
    m: 4.5,
    p: 4.5
  },
  'Creme de Chocolate Branco': {
    gg: 5.5,
    g: 5.5,
    m: 4.5,
    p: 4.5
  },
  'Calda de Chocolate': {
    gg: 3,
    g: 2.5,
    m: 2,
    p: 1.5
  },
  'Calda de Morango': {
    gg: 3,
    g: 2.5,
    m: 2,
    p: 1.5
  },
  'M&M\'s': {
    gg: 3,
    g: 3,
    m: 2,
    p: 2
  },
  'Bib\'s': {
    gg: 4,
    g: 4,
    m: 3,
    p: 3
  },
}