import { slang } from '@/domain/format';

export const bebidaCategory: Category<Product> = {
  slang: 'bebidas',
  quickAdd: true,
  description: 'Bebidas variadas para acompanhar seu lanche ou sobremesa.',
  products: [
    {
      img: '/img/bebidas/coca-600.png',
      name: 'Coca-Cola 600ml',
    },
    {
      img: '/img/bebidas/coca-zero-600.avif',
      name: 'Coca-Cola Zero 600ml',
    },
    {
      img: '/img/bebidas/guarana-600.avif',
      name: 'Guaraná 600ml',
    },
    {
      img: '/img/bebidas/sprite-600.avif',
      name: 'Sprite 600ml',
    },
  ].map(product => ({
    ...product,
    fullPrice: 10,
    price: 10,
    people: 1,
    slang: slang(product.name),
    description: 'Bebida gelada para acompanhar seu lanche ou sobremesa.',
  })),
};
