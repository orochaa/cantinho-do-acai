export const geladinhoCategory: Category<
  Product,
  { flavors: { name: string; price: number }[] }
> = {
  slang: 'geladinho',
  description:
    'Geladinhos gourmet, feitos com ingredientes selecionados e nos sabores mais pedidos. Uma explosão de sabor e refrescância a cada mordida.',
  products: [
    {
      img: '/img/Geladinho de Morango com Nutella.jpg',
      name: 'Geladinho Gourmet',
      fullPrice: 8,
      price: 6,
      people: 1,
      quantity: 70,
      slang: 'geladinho-gourmet',
      description:
        'Geladinho gourmet recheado com um creme especial e coberto com raspas de chocolate ou creme de chocolate',
    },
  ],
  flavors: [
    { name: 'Morango com Nutella', price: 6 },
    { name: 'Ninho com Nutella', price: 6 },
    { name: 'Oreo', price: 6 },
  ],
}
