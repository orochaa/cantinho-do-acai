/* eslint-disable no-secrets/no-secrets */
export type AcaiExtra =
  | 'KitKat'
  | 'Bis'
  | 'Amor Carioca'
  | 'Chocolate Preto'
  | 'Bala de Goma'
  | 'Diamante Negro'
  | 'Laka'
  | 'Charge'
  | '5 Star'
  | 'Stikadinho'
  | "M&M's"
  | "Bib's"
  | 'Kiwi'
  | 'Marshmallow'
  | 'Creme de Ninho'
  | 'Creme de Chocolate Branco'
  | 'Creme de Avelã'
  | 'Creme de Oreo'
  | 'Creme de Morango'
  | 'Creme de Ovomaltine'
  | 'Creme de Kit Kat'
  | 'Creme de Pistache'
  | 'Creme de Beijinho'
  | 'Creme de Bombom'
  | 'Creme Meio Amargo'
  | 'Creme de Cappuccino'
  | 'Creme de Doce de Leite'
  | 'Calda de Chocolate'
  | 'Calda de Morango'

export const ACAI_EXTRA: Record<
  AcaiExtra,
  {
    img: string
  }
> = {
  '5 Star': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201043_LSUN_i.jpg',
  },
  'Amor Carioca': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201037_8A16_i.jpg',
  },
  'Bala de Goma': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201016_IR4H_i.jpg',
  },
  "Bib's": {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201046_7MDS_i.jpg',
  },
  Bis: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201037_WV54_i.jpg',
  },
  'Calda de Chocolate': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201044_LO3L_i.jpg',
  },
  'Calda de Morango': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201044_0J6S_i.jpg',
  },
  Charge: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201043_S8B5_i.jpg',
  },
  'Creme de Kit Kat': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201042_6650_i.jpg',
  },
  'Creme Meio Amargo': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011840_81PU_i.jpg',
  },
  'Creme de Ovomaltine': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011827_28D1_i.jpg',
  },
  'Creme de Pistache': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011841_8V2X_i.jpg',
  },
  'Creme de Avelã': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201043_ONC1_i.jpg',
  },
  'Creme de Beijinho': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011842_M0SS_i.jpg',
  },
  'Creme de Bombom': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011843_71T7_i.jpg',
  },
  'Creme de Cappuccino': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011839_64JJ_i.jpg',
  },
  'Creme de Chocolate Branco': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201044_W46K_i.jpg',
  },
  'Creme de Doce de Leite': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011840_LG15_i.jpg',
  },
  'Creme de Morango': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201044_54PP_i.jpg',
  },
  'Creme de Ninho': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201044_PC83_i.jpg',
  },
  'Creme de Oreo': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201043_M54G_i.jpg',
  },
  'Diamante Negro': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201023_30P7_i.jpg',
  },
  KitKat: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201042_6GDU_i.jpg',
  },
  Kiwi: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511011811_5I54_i.jpg',
  },
  Laka: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201023_1AAP_i.jpg',
  },
  "M&M's": {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201042_K223_i.jpg',
  },
  Marshmallow: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202511250100_JGS0_i.jpg',
  },
  Stikadinho: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201025_12P4_i.jpg',
  },
  'Chocolate Preto': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202505201037_4840_i.jpg',
  },
}
