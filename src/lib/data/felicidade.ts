import { slang } from '../format'

export const felicidadeCategory: Category<
  Product,
  { size: { name: string; price: number }[] }
> = {
  path: 'felicidade',
  description:
    'Nossos copos da felicidade são uma explosão de sabores, com combinações irresistíveis de cremes, frutas e chocolates que vão te surpreender a cada colherada.',
  products: [
    {
      img: '/img/copo-da-felicidade-morango.avif',
      name: 'Copo da Felicidade de Morango',
      description:
        'O Copo da Felicidade de Morango é uma deliciosa combinação de sabores e texturas. Composto por suculentos morangos frescos, harmoniosamente unidos a uma generosa camada de chocolate preto intensamente rico e um sedutor chocolate branco cremoso. Cada mordida oferece uma experiência gustativa inesquecível, tornando este prato um verdadeiro copo da felicidade. Ideal para os amantes de doces e para quem procura algo irresistível e especial.',
      people: 1,
      fullPrice: 22,
      price: 20,
    },
    {
      img: '/img/copo-da-felicidade-uva.avif',
      name: 'Copo da Felicidade de Uva',
      description:
        'O Copo da Felicidade de Uva é uma deliciosa sobremesa da categoria Copo da Felicidade. Este prato encantador é composto por uma generosa porção de uvas frescas e suculentas, cuidadosamente selecionadas. Além disso, acompanha um cremoso e sedutor creme de chocolate preto, que agrega profundidade e um toque de indulgência ao prato. Para completar, um suave e aveludado creme de chocolate branco equilibra perfeitamente a riqueza do chocolate preto, proporcionando uma experiência gastronômica verdadeiramente harmoniosa e inesquecível. Esta é, sem dúvida, uma festa para o paladar!',
      people: 1,
      fullPrice: 22,
      price: 20,
    },
    {
      img: '/img/copo-da-felicidade-ouro-branco.avif',
      name: 'Copo da Felicidade de Ouro Branco',
      description:
        'Nosso Copo da Felicidade de Ouro Branco é uma celebração de sabores. Ele é delicadamente composto por Ouro Branco, uma iguaria encantadora que derrete na boca. Acompanhado de um cremoso e irresistível creme de chocolate preto, que se entrelaça perfeitamente com o suave e luxuoso creme de chocolate branco. Este prato é uma verdadeira experiência sensorial, uma sinfonia de texturas e sabores que prometem satisfazer até os paladares mais exigentes. Uma delícia irresistível da categoria Copo da Felicidade, perfeita para tornar qualquer momento mais doce e especial.',
      people: 1,
      fullPrice: 22,
      price: 20,
    },
    {
      img: '/img/copo-da-felicidade-kinder-bueno.avif',
      name: 'Copo da Felicidade de Kinder Bueno',
      description:
        'Descubra a pura alegria encapsulada em nosso Copo da Felicidade de Kinder Bueno. Este prato é uma harmoniosa combinação de ingredientes: o irresistível Kinder Bueno, que adiciona uma textura crocante e um sabor de avelã distintivo; um creme de chocolate preto, que proporciona um toque de luxo e sofisticação; e por fim, o creme de chocolate branco, que equilibra perfeitamente, com sua doçura suave e cremosidade inigualável. Uma experiência de sabor inesquecível que transcende o ordinário, tornando cada colherada um momento de felicidade.',
      people: 1,
      fullPrice: 32,
      price: 23,
    },
  ].map(p => ({ slang: slang(p.name), ...p })),
  size: [
    {
      name: 'Copo Pequeno',
      price: 0,
    },
    {
      name: 'Copo Médio',
      price: 3,
    },
  ],
}
