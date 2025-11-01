export type AcaiExtra =
  | 'KitKat'
  | 'Bis'
  | 'Amor Carioca'
  | 'Batom'
  | 'Bala de Goma'
  | 'Diamante Negro'
  | 'Laka'
  | 'Charge'
  | '5 Star'
  | 'Stikadinho'
  | "M&M's"
  | "Bib's"
  | 'Kiwi'
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

export const ACAI_EXTRA_GROUP = {
  'Marmita Turbinada': {
    Kiwi: 4,
    KitKat: 7,
    Bis: 5,
    'Amor Carioca': 6,
    Batom: 6,
    'Bala de Goma': 5,
    'Diamante Negro': 6,
    Laka: 6,
    Charge: 5,
    '5 Star': 8,
    Stikadinho: 8,
    'Creme de Chocolate Branco': 11,
    'Creme de Avelã': 11,
    'Creme de Oreo': 11,
    'Creme de Morango': 11,
    'Creme de Beijinho': 11,
    'Creme de Bombom': 11,
    'Creme de Ninho': 11,
    'Creme Meio Amargo': 11,
    'Creme de Cappuccino': 11,
    'Creme de Doce de Leite': 11,
    'Creme de Ovomaltine': 15,
    'Creme de Kit Kat': 15,
    'Creme de Pistache': 15,
    'Calda de Chocolate': 6,
    'Calda de Morango': 6,
    "M&M's": 6,
    "Bib's": 8,
  },
  'Copo Grande': {
    Kiwi: 2,
    '5 Star': 4,
    'Amor Carioca': 3,
    'Bala de Goma': 3,
    'Diamante Negro': 3,
    "Bib's": 4,
    "M&M's": 3,
    Batom: 3,
    Bis: 3,
    Charge: 4,
    KitKat: 3.5,
    Laka: 3,
    Stikadinho: 3,
    'Creme de Avelã': 5.5,
    'Creme de Beijinho': 5.5,
    'Creme de Bombom': 5.5,
    'Creme de Cappuccino': 5.5,
    'Creme de Chocolate Branco': 5.5,
    'Creme de Doce de Leite': 5.5,
    'Creme de Morango': 5.5,
    'Creme de Ninho': 5.5,
    'Creme de Oreo': 5.5,
    'Creme Meio Amargo': 5.5,
    'Creme de Ovomaltine': 7.5,
    'Creme de Pistache': 7.5,
    'Creme de Kit Kat': 7.5,
    'Calda de Chocolate': 3,
    'Calda de Morango': 3,
  },
  'Copo Médio/Pequeno': {
    Kiwi: 2,
    '5 Star': 3,
    'Amor Carioca': 2,
    'Bala de Goma': 2,
    'Diamante Negro': 2,
    "Bib's": 3,
    "M&M's": 2,
    Batom: 2,
    Bis: 2,
    Charge: 3,
    KitKat: 2.5,
    Laka: 2,
    Stikadinho: 2,
    'Creme de Avelã': 4.5,
    'Creme de Beijinho': 4.5,
    'Creme de Bombom': 4.5,
    'Creme de Cappuccino': 4.5,
    'Creme de Chocolate Branco': 4.5,
    'Creme de Doce de Leite': 4.5,
    'Creme de Morango': 4.5,
    'Creme de Ninho': 4.5,
    'Creme de Oreo': 4.5,
    'Creme Meio Amargo': 4.5,
    'Creme de Ovomaltine': 6.5,
    'Creme de Pistache': 6.5,
    'Creme de Kit Kat': 6.5,
    'Calda de Chocolate': 2,
    'Calda de Morango': 2,
  },
} satisfies Record<string, Record<AcaiExtra, number>>
