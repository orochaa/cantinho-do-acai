import { entries } from 'remeda'

/* eslint-disable no-secrets/no-secrets */
export type AcaiComplement =
  | 'Banana'
  | 'Morango'
  | 'Manga'
  | 'Leite Condensado'
  | 'Leite Ninho'
  | 'Granola'
  | 'Paçoca'
  | 'Ovomaltine'
  | 'Chocoball'
  | 'Sucrilhos'

export const ACAI_COMPLEMENTS: Record<AcaiComplement, { img: string }> = {
  Banana: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201002_13NL_i.jpg',
  },
  Morango: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201002_X5FI_i.jpg',
  },
  Manga: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011810_2F8D_i.jpg',
  },
  'Leite Condensado': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201003_4587_i.jpg',
  },
  'Leite Ninho': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201036_GP3X_i.jpg',
  },
  Granola: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201006_81Y4_i.jpg',
  },
  Paçoca: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201004_3PO3_i.jpg',
  },
  Ovomaltine: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201009_07S2_i.jpg',
  },
  Chocoball: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202510222327_IR00_i.jpg',
  },
  Sucrilhos: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201007_8A7Y_i.jpg',
  },
}

export const acaiComplements = entries(ACAI_COMPLEMENTS).map(
  ([name, data]) => ({
    ...data,
    name,
  })
)
