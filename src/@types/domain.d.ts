type Category<
  TProduct extends Product = Product,
  TExtras extends Record<string, unknown> = Record<string, unknown>,
> = {
  slang: string;
  products: Array<TProduct>;
  description: string;
  quickAdd?: boolean;
  disabled?: boolean;
} & TExtras;

interface Product {
  img: string;
  name: string;
  description: string;
  slang: string;
  quantity?: number;
  fullPrice: number;
  price: number;
  people: number;
  disabled?: boolean;
  acceptsObservation?: boolean;
  highlights?: Array<import('@/domain/highlights').Highlight>;
}

interface Option<TName extends string = string> {
  name: TName;
  count: number;
  price?: number;
  img?: string;
}
