export type Size = 'p' | 'm' | 'g' | 'gg'

export type Category = {
  to: string
  products: Product[]
}

export type Product = {
  img: string
  name: string
  people: number
  quantity: number
  size: Size
  price: number
  complements: number
  extras: number
}

export type ComplementState = {
  name: string
  count: number
  total: number
  max: number
  price?: number
}

export type ComplementEvent = {
  type: 'ADD' | 'REMOVE'
  complement: string
}
