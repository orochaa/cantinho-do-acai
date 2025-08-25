import { slang } from '../format'

export type Salgado = Product & {
  complementsLimit: number
  complements: string[]
  saucesLimit: number
  sauces: string[]
}

export const salgadosCategory: Category<Salgado> = {
  path: 'salgados',
  description:
    'Deliciosos salgados para matar a sua fome. Escolha o seu kit e se delicie.',
  products: [
    {
      img: '/img/salgados-pequeno.jpeg',
      name: 'Kit Salgados Pequeno + Mini Coca',
      description:
        'Um kit de salgados com 15 unidades, com molho e uma mini Coca (caçulinha)',
      people: 1,
      fullPrice: 25,
      price: 20,
      quantity: 300,
      complementsLimit: 15,
      saucesLimit: 1,
    },
    {
      img: '/img/salgados-medio.jpeg',
      name: 'Kit Salgados Médio',
      description:
        'Um kit de salgados com 25 unidades, mais um ou dois molhos complementares.',
      people: 2,
      fullPrice: 35,
      price: 28,
      quantity: 500,
      complementsLimit: 5,
      saucesLimit: 2,
    },
  ].map(p => ({
    slang: slang(p.name),
    complements: [
      // 'Churros de Doce de Leite',
      'Croquete',
      'Coxinha de Frango',
      'Almofadinha de Presunto e Queijo',
      'Risoles de Carne',
      'Risoles de Frango',
      'Bolinha de Queijo',
      'Enroladinho de Salsicha',
      'Bacon com Queijo',
    ],
    sauces: [
      // 'Molho Cheddar',
      'Molho de Catupiri',
    ],
    ...p,
  })),
}
