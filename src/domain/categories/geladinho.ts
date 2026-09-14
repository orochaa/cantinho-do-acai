import { slang } from '@/domain/format';

const geladinhoFlavors = [
  {
    name: 'Maracujá com Nutella',
    price: 7,
    img: '/img/geladinho/geladinho-de-maracuja-com-nutella.avif',
  },
  {
    name: 'Maracujá com Geleia de Maracujá (pequeno)',
    price: 5,
    img: '/img/geladinho/geladinho-de-maracuja-com-geleia-de-maracuj.jpeg',
  },
  {
    name: 'Maracujá com Nutella (pequeno)',
    price: 5,
    img: '/img/geladinho/geladinho-de-maracuja-com-nutella.avif',
  },
  {
    name: 'Oreo com Creme de Chocolate Branco (pequeno)',
    price: 5,
    img: '/img/geladinho/geladinho-de-oreo-com-creme-de-chocolate-branco.jpeg',
  },
  {
    name: 'Ninho com Nutella (pequeno)',
    price: 5,
    img: '/img/geladinho/geladinho-de-ninho-com-nutella.jpg',
  },
  {
    name: 'Morango com Nutella (pequeno)',
    price: 5,
    img: '/img/geladinho/geladinho-de-morango-com-nutella.jpg',
  },
];

export const geladinhoCategory: Category<
  Product,
  { flavors: Array<{ name: string; price: number; img: string }> }
> = {
  slang: 'geladinho',
  quickAdd: true,
  description:
    'Geladinhos gourmet, feitos com ingredientes selecionados e nos sabores mais pedidos. Uma explosão de sabor e refrescância a cada mordida.',
  flavors: geladinhoFlavors,
  products: geladinhoFlavors.map(flavor => ({
    img: flavor.img,
    name: `Geladinho de ${flavor.name}`,
    description:
      'Geladinho gourmet recheado com um creme especial e coberto com raspas de chocolate ou creme de chocolate.',
    fullPrice: flavor.price === 5 ? 6 : 8,
    price: flavor.price,
    people: 1,
    quantity: 70,
    slang: slang(`Geladinho de ${flavor.name}`),
  })),
};
