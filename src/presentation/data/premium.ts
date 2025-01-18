import { slang } from './helpers'

export type Premium = Product & {
  complements?: string[]
}

export const premiumCategory: Category<Premium> = {
  path: 'premium',
  products: [
    {
      img: '/img/finifest.avif',
      name: 'Fini fest',
      description: `Para quem ama o sabor das balas Fini, preparamos uma versão incrível em copo! Cada copo acompanha:

Bala Fini (escolha o seu sabor favorito)
Creme e cobertura de acordo com o sabor escolhido
Leite em pó
Leite condensado
Uma combinação doce e divertida que traz o sabor das balas para uma experiência ainda mais gostosa. Escolha seu sabor Fini e aproveite!`,
      people: 1,
      price: 23.5,
      quantity: 440,
      complements: ['Fini banana', 'Fini dentadura', 'Fini beijinho'],
    },
    {
      img: '/img/galagresco.avif',
      name: 'Galagresco',
      description: `Uma combinação perfeita para quem ama o sabor único do Negresco com o toque suave do chocolate branco! No nosso copo, você vai encontrar:

Negresco crocante
Leite condensado
Leite em pó
Creme de Oreo
Chocolate Galak
Uma mistura irresistível que vai te surpreender a cada colherada. Sinta a cremosidade e o sabor delicioso dessa combinação única!`,
      people: 1,
      price: 23.5,
      quantity: 440,
    },
    {
      img: '/img/kinder-ninho.avif',
      name: 'Kinder Ninho',
      description: `Delicie-se com o nosso copo exclusivo recheado de sabores irresistíveis. Feito especialmente para os apaixonados por chocolate, ele traz:

Pedaços generosos de Kinder Bueno
Creme de Ninho
Leite condensado
Leite em pó
Creme de avelã
Chantilly de chocolate
Uma combinação perfeita que derrete na boca e transforma cada colherada em um momento único. Experimente e surpreenda-se!`,
      people: 1,
      price: 23.5,
      quantity: 440,
    },
    {
      img: '/img/maramor.jpg',
      name: 'Maramor',
      description: `Experimente a combinação perfeita de cremosidade e frescor com o nosso copo de maracujá! Ele traz:

Creme de maracujá
Leite condensado
Leite em pó
Creme de avelã
Chantilly de maracujá
Bombom Amor Carioca
Cada ingrediente foi escolhido para criar uma explosão de sabores tropicais que vão te conquistar. Uma verdadeira experiência refrescante e deliciosa!`,
      people: 1,
      price: 23.5,
      quantity: 440,
    },
    {
      img: '/img/tentacao.avif',
      name: 'Tentação',
      description: `Descubra o sabor único do nosso copo Sensação, uma experiência irresistível para os amantes de açaí! Combinação perfeita de:
Creme de morango
Leite condensado
Leite em pó
Creme de avelã
Bombom amor carioca
Chantilly de morango
Morangos frescos
Camadas deliciosas que tornam cada colherada uma verdadeira explosão de sabor. Ideal para quem busca algo além do comum!`,
      people: 1,
      price: 23.5,
      quantity: 440,
    },
  ].map(item => ({ ...item, slang: slang(item.name) })),
}
