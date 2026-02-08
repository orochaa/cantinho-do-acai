import { ACAI_EXTRA_GROUP } from '@/lib/data/extras'
import type { AcaiExtra } from '@/lib/data/extras'
import { slang } from '../format'

export type Acai = Product & {
  type: string[]
  complementsLimit: number
  complements: string[]
  extrasLimit: number
  extras: Record<AcaiExtra, number>
}

export const acaiCategory: Category<Acai> = {
  slang: 'acai',
  description:
    'O melhor açaí da região, com ingredientes frescos e de qualidade. Monte o seu açaí do seu jeito, com diversos acompanhamentos e cremes.',
  products: [
    {
      img: '/img/acai/barca.jfif',
      name: 'Barca de Açaí',
      people: 4,
      fullPrice: 65,
      price: 50,
      quantity: 1000,
      complementsLimit: 7,
      extrasLimit: 10,
      extras: ACAI_EXTRA_GROUP['Copo Grande'],
    },
    {
      img: '/img/acai/kit-para-familia.jpeg',
      name: 'Kit para Família',
      people: 4,
      fullPrice: 52,
      price: 40,
      quantity: 900,
      complementsLimit: 7,
      extrasLimit: 15,
      extras: ACAI_EXTRA_GROUP['Copo Grande'],
    },
    {
      img: '/img/acai/marmitex-turbinada.avif',
      name: 'Marmitex Turbinada',
      people: 3,
      fullPrice: 50,
      price: 37,
      quantity: 800,
      complementsLimit: 5,
      extrasLimit: 15,
      extras: ACAI_EXTRA_GROUP['Marmita Turbinada'],
    },
    {
      img: '/img/acai/marmitex.avif',
      name: 'Marmitex do Cantinho',
      people: 3,
      fullPrice: 35,
      price: 30,
      quantity: 800,
      complementsLimit: 5,
      extrasLimit: 15,
      extras: ACAI_EXTRA_GROUP['Copo Grande'],
    },
    {
      img: '/img/acai/copo-grande.avif',
      name: 'Copo de Açaí Grande',
      people: 1,
      fullPrice: 35,
      price: 30,
      quantity: 770,
      complementsLimit: 5,
      extrasLimit: 10,
      extras: ACAI_EXTRA_GROUP['Copo Grande'],
    },
    {
      img: '/img/acai/copo-medio.jpeg',
      name: 'Copo de Açaí Médio',
      people: 1,
      fullPrice: 23,
      price: 17,
      quantity: 440,
      complementsLimit: 3,
      extrasLimit: 10,
      extras: ACAI_EXTRA_GROUP['Copo Médio/Pequeno'],
    },
    {
      img: '/img/acai/copo-pequeno.jpeg',
      name: 'Copo de Açaí Pequeno',
      people: 1,
      fullPrice: 14,
      price: 12,
      quantity: 250,
      complementsLimit: 3,
      extrasLimit: 5,
      extras: ACAI_EXTRA_GROUP['Copo Médio/Pequeno'],
    },
  ].map(p => ({
    slang: slang(p.name),
    type: ['Açaí Tradicional', 'Açaí com Sorvete de Ninho'],
    description:
      'Monte o seu copo de açaí! Escolha entre nossos deliciosos complementos para criar o seu próprio refresco personalizado.',
    complements: [
      'Banana',
      'Morango',
      'Manga',
      'Leite Condensado',
      'Leite Ninho',
      'Granola',
      'Paçoca',
      'Ovomaltine',
      'Chocoball',
      'Sucrilhos',
    ],
    ...p,
  })),
}
