import { slang } from '@/domain/format';

export const paletaCategory: Category<Product> = {
  disabled: false,
  slang: 'paleta',
  quickAdd: true,
  description:
    'Paletas italianas, saborosas e refrescantes, perfeitas para qualquer ocasião.',
  products: [
    {
      img: '/img/paleta/paleta.jpg',
      name: 'Morango com Leite Condensado',
    },
    {
      img: '/img/paleta/paleta-de-chocolate.png',
      name: 'Chocolate com Leite Condensado',
    },
    {
      img: '/img/paleta/paleta-de-maracuja.JPG',
      name: 'Maracujá com Leite Condensado',
    },
    {
      img: '/img/paleta/paleta-de-ninho.JPG',
      name: 'Ninho com Nutella',
    },
    {
      img: '/img/paleta/paleta-de-acai.jpg',
      name: 'Ferrero Rochet',
    },
  ].map(product => ({
    ...product,
    name: `Paleta de ${product.name}`,
    fullPrice: 12,
    price: 10,
    people: 1,
    quantity: 105,
    description: `Paleta italiana de ${product.name.toLowerCase()}.`,
    slang: slang(`Paleta de ${product.name}`),
    acceptsObservation: false,
  })),
};
