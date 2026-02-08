/* eslint-disable no-secrets/no-secrets */
import { entries } from 'remeda'

export type AcaiType =
  | 'Açaí Tradicional'
  | 'Açaí com Sorvete de Ninho'
  | 'Cupuaçu'

export const ACAI_TYPE: Record<AcaiType, { img: string }> = {
  'Açaí Tradicional': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202312161921_7FM0_i.jpg',
  },
  'Açaí com Sorvete de Ninho': {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202312161916_1865_i.jpg',
  },
  Cupuaçu: {
    img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202512122002_80P3_i.jpg',
  },
}

export const acaiType = entries(ACAI_TYPE).map(([name, data]) => ({
  ...data,
  name,
}))
