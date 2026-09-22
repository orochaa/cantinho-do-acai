import { slang } from '@/domain/format';
import type { Highlight } from '@/domain/highlights';

export const felicidadeCategory: Category<Product> = {
  slang: 'felicidade',
  quickAdd: true,
  description:
    'Nossos copos da felicidade são uma explosão de sabores, com combinações irresistíveis de cremes caseiros, frutas e chocolates que vão te surpreender a cada colherada.',
  products: [
    {
      img: '/img/felicidade/copo-da-felicidade-morango.avif',
      name: 'Copo da Felicidade de Morango',
      description:
        'O Copo da Felicidade de Morango é uma deliciosa combinação de sabores e texturas. Composto por suculentos morangos frescos, harmoniosamente unidos a uma generosa camada de chocolate preto intensamente rico e um sedutor chocolate branco cremoso. Cada mordida oferece uma experiência gustativa inesquecível, tornando este prato um verdadeiro copo da felicidade. Ideal para os amantes de doces e para quem procura algo irresistível e especial.',
      people: 1,
      fullPrice: 25,
      price: 25,
      highlights: [
        {
          type: 'weekly-promo',
          weekday: 'tuesday',
          price: 22,
        } satisfies Highlight,
      ],
    },
    {
      img: '/img/felicidade/copo-da-felicidade-uva.avif',
      name: 'Copo da Felicidade de Uva',
      description:
        'O Copo da Felicidade de Uva é uma deliciosa sobremesa da categoria Copo da Felicidade. Este prato encantador é composto por uma generosa porção de uvas frescas e suculentas, cuidadosamente selecionadas. Além disso, acompanha um cremoso e sedutor creme de chocolate preto, que agrega profundidade e um toque de indulgência ao prato. Para completar, um suave e aveludado creme de chocolate branco equilibra perfeitamente a riqueza do chocolate preto, proporcionando uma experiência gastronômica verdadeiramente harmoniosa e inesquecível. Esta é, sem dúvida, uma festa para o paladar!',
      people: 1,
      fullPrice: 25,
      price: 25,
      highlights: [
        {
          type: 'weekly-promo',
          weekday: 'tuesday',
          price: 22,
        } satisfies Highlight,
      ],
    },
    {
      img: '/img/felicidade/copo-da-felicidade-ouro-branco.avif',
      name: 'Copo da Felicidade de Ouro Branco',
      description:
        'Nosso Copo da Felicidade de Ouro Branco é uma celebração de sabores. Ele é delicadamente composto por Ouro Branco, uma iguaria encantadora que derrete na boca. Acompanhado de um cremoso e irresistível creme de chocolate preto, que se entrelaça perfeitamente com o suave e luxuoso creme de chocolate branco. Este prato é uma verdadeira experiência sensorial, uma sinfonia de texturas e sabores que prometem satisfazer até os paladares mais exigentes. Uma delícia irresistível da categoria Copo da Felicidade, perfeita para tornar qualquer momento mais doce e especial.',
      people: 1,
      fullPrice: 25,
      price: 25,
      highlights: [
        {
          type: 'weekly-promo',
          weekday: 'tuesday',
          price: 22,
        } satisfies Highlight,
      ],
    },
    {
      img: '/img/felicidade/copo-da-felicidade-kinder-bueno.avif',
      name: 'Copo da Felicidade de Kinder Bueno',
      description:
        'Descubra a pura alegria encapsulada em nosso Copo da Felicidade de Kinder Bueno. Este prato é uma harmoniosa combinação de ingredientes: o irresistível Kinder Bueno, que adiciona uma textura crocante e um sabor de avelã distintivo; um creme de chocolate preto, que proporciona um toque de luxo e sofisticação; e por fim, o creme de chocolate branco, que equilibra perfeitamente, com sua doçura suave e cremosidade inigualável. Uma experiência de sabor inesquecível que transcende o ordinário, tornando cada colherada um momento de felicidade.',
      people: 1,
      fullPrice: 35,
      price: 28,
    },
    {
      img: '/img/felicidade/copo-da-felicidade-cravejado.jpg',
      name: 'Copo da Felicidade Cravejado',
      description:
        'O Copo da Felicidade Cravejado é uma experiência de sabor única. Este prato é uma combinação perfeita de texturas e sabores, começando com o irresistível Cravejado, que oferece uma explosão de sabor a cada mordida. Acompanhado por um cremoso creme de chocolate preto, que adiciona profundidade e riqueza ao prato, e finalizado com um suave creme de chocolate branco, que equilibra a intensidade do chocolate preto com sua doçura delicada. Cada colherada é uma celebração da felicidade, tornando este prato uma escolha perfeita para quem busca uma sobremesa verdadeiramente especial.',
      people: 1,
      fullPrice: 35,
      price: 30,
      highlights: [
        {
          type: 'weekly-promo',
          weekday: 'monday',
          price: 25,
        } satisfies Highlight,
      ],
    },
  ].map(p => ({ slang: slang(p.name), ...p })),
};
