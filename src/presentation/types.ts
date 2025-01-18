export type Category<
  TProduct extends Product = Product,
  TExtras extends Record<string, unknown> = {},
> = {
  path: string
  products: TProduct[]
} & TExtras

export interface Product {
  img: string
  name: string
  slang: string
  quantity?: number
  price: number
  people: number
}

export interface Complement {
  name: string
  count: number
  price?: number
}
