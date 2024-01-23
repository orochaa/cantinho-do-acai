export type Size = 'p' | 'm' | 'g' | 'gg'

export interface Category {
  to: string
  products: Product[]
}

export interface Product {
  img: string
  name: string
  people: number
  quantity: number
  size: Size
  price: number
  complements: number
  extras: number
}

export interface ComplementState {
  name: string
  count: number
  total: number
  max: number
  price?: number
}

export interface ComplementEvent {
  type: 'ADD' | 'REMOVE'
  complement: string
}
