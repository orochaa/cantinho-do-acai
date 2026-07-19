import { slang } from '../format';

export const pastelCategory: Category<
  Product,
  { size: Array<{ name: string; price: number }> }
> = {
  slang: 'pastel',
  description: '',
  products: [
    {
      img: '/img/pastel/pastel-de-frango.avif',
      name: 'Pastel de Frango',
      description: '',
      fullPrice: 15,
      price: 15,
      people: 1,
    },
    {
      img: '/img/pastel/pastel-de-queijo.jpg',
      name: 'Pastel de Queijo',
      description: '',
      fullPrice: 15,
      price: 15,
      people: 1,
    },
    {
      img: '/img/pastel/pastel-de-presunto-e-queijo.avif',
      name: 'Pastel de Presunto e Queijo',
      description: '',
      fullPrice: 15,
      price: 15,
      people: 1,
    },
    {
      img: '/img/pastel/pastel-romeo-e-julieta.avif',
      name: 'Pastel Romeo e Julieta',
      description: '',
      fullPrice: 18,
      price: 18,
      people: 1,
    },
    {
      img: '/img/pastel/pastel-de-chocolate.jpg',
      name: 'Pastel de Chocolate Preto',
      description: '',
      fullPrice: 18,
      price: 18,
      people: 1,
    },
    {
      img: '/img/pastel/pastel-de-chocolate-branco.avif',
      name: 'Pastel de Chocolate Branco',
      description: '',
      fullPrice: 18,
      price: 18,
      people: 1,
    },
    {
      img: '/img/pastel/pastel-de-morango-e-creme-de-avela.avif',
      name: 'Pastel de Morango e Creme de Avelã',
      description: '',
      fullPrice: 18,
      price: 18,
      people: 1,
    },
  ].map(p => ({ slang: slang(p.name), ...p })),
  size: [
    {
      name: 'Pastel Pequeno',
      price: -10,
    },
    {
      name: 'Pastel Médio',
      price: 0,
    },
    {
      name: 'Pastel Grande',
      price: 10,
    },
  ],
};
