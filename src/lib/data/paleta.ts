import { slang } from '../format'

export const paletaCategory: Category<
  Product,
  { flavors: { name: string; price: number }[] }
> = {
  slang: 'paleta',
  description:
    'Paletas italianas, saborosas e refrescantes, perfeitas para qualquer ocasião.',
  products: [
    {
      img: '/img/paleta.jpg',
      name: 'Paleta Italiana',
      fullPrice: 12,
      price: 10,
      people: 1,
      quantity: 105,
    },
  ].map(p => ({ ...p, slang: slang(p.name), description: '' })),
  flavors: [
    { name: 'Morango com Leite Condensado', price: 10 },
    { name: 'Açaí com Leite Condensado', price: 10 },
    { name: 'Chocolate com Leite Condensado', price: 10 },
    { name: 'Maracujá com Leite Condensado', price: 10 },
    { name: 'Ninho com Nutella', price: 10 },
  ],
}
