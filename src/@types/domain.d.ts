type Category<
  TProduct extends Product = Product,
  TExtras extends Record<string, unknown> = {},
> = {
  slang: string
  products: TProduct[]
  description: string
  disabled?: boolean
} & TExtras

interface Product {
  img: string
  name: string
  description: string
  slang: string
  quantity?: number
  fullPrice: number
  price: number
  people: number
  disabled?: boolean
}

interface Option<TName extends string = string> {
  name: TName
  count: number
  price?: number
  img?: string
}
