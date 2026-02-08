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
    { name: 'Geladinho de Maracujá com Nutella', price: 7 },
    {
      name: 'Geladinho de Maracujá com Geleia de Maracujá (pequeno)',
      price: 5,
    },
    { name: 'Geladinho de Maracujá com Nutella (pequeno)', price: 5 },
    {
      name: 'Geladinho de Oreo com Creme de Chocolate Branco (pequeno)',
      price: 5,
    },
    { name: 'Geladinho de Ninho com Nutella (pequeno)', price: 5 },
    { name: '⁠Geladinho de Morango com Nutella (pequeno)', price: 5 },
  ],
}
