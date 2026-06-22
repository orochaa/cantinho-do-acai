import { slang } from '../format'

export type Salgado = Product & {
  complementsLimit: number
  complements: string[]
  sauces: string[]
}

export const salgadosCategory: Category<Salgado> = {
  slang: 'salgados',
  description:
    'Deliciosos salgados para matar a sua fome. Escolha o seu kit e se delicie.',
  products: [
    {
      img: '/img/salgados/salgados-pequeno.jpeg',
      name: 'Kit Salgados Pequeno + Mini Coca',
      description:
        'Um kit de salgados com 10 unidades, com molho e uma mini Coca (caçulinha)',
      people: 1,
      fullPrice: 26,
      price: 20,
      quantity: 360,
      complementsLimit: 10,
    },
    {
      img: '/img/salgados/salgados-medio.jpeg',
      name: 'Kit Salgados Médio',
      description:
        'Um kit de salgados com 15 unidades, mais um ou dois molhos complementares.',
      people: 2,
      fullPrice: 39,
      price: 32,
      quantity: 540,
      complementsLimit: 15,
    },
  ].map(p => ({
    slang: slang(p.name),
    complements: [
      'Rissoles de Carne',
      'Rissoles de Frango',
      'Rissoles de Presunto e Queijo',
      'Rissoles de Palmito e Queijo',
      'Rissoles de Milho, Orégano e Queijo',
      'Rissoles de Goiabada e Queijo',
      'Bolinha de Queijo',
      'Croquete de Carne',
      'Coxinha de Frango',
      'Enroladinho de Salsicha',
    ],
    sauces: [
      // 'Molho Cheddar',
      'Molho de Catupiri',
    ],
    ...p,
  })),
}
