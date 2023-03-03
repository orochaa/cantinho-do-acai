export type Size = 'p' | 'm' | 'g' | 'gg'

export type Product = {
  img: string
  name: string
  people: number
  quantity: number
  size: Size
  price: number
}

export const products: Product[] = [
  {
    img: '/img/kit-para-familia.jpeg',
    name: 'Kit para Família',
    people: 4,
    price: 45,
    quantity: 1000,
    size: 'gg'
  },
  {
    img: '/img/acai.jpg',
    name: 'Marmitex do Cantinho',
    people: 3,
    price: 30,
    quantity: 900,
    size: 'g'
  },
  {
    img: '/img/acai.jpg',
    name: 'Copo Grande',
    people: 1,
    price: 26,
    quantity: 770,
    size: 'g'
  },
  {
    img: '/img/copo-medio.jpeg',
    name: 'Copo Médio',
    people: 1,
    price: 17,
    quantity: 440,
    size: 'm'
  },
  {
    img: '/img/copo-pequeno.jpeg',
    name: 'Copo Pequeno',
    people: 1,
    price: 12,
    quantity: 250,
    size: 'p'
  }
]
