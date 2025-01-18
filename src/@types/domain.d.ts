type Category<
  TProduct extends Product = Product,
  TExtras extends Record<string, unknown> = {},
> = {
  path: string
  products: TProduct[]
} & TExtras

interface Product {
  img: string
  name: string
  description: string
  slang: string
  quantity?: number
  price: number
  people: number
}

interface Complement {
  name: string
  count: number
  price?: number
}
