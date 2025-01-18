export const geladinhoCategory: Category<
  Product,
  { flavors: { name: string; price: number }[] }
> = {
  path: 'geladinho',
  products: [
    {
      img: '/img/Geladinho de Morango com Nutella.jpg',
      name: 'Geladinho Gourmet',
      fullPrice: 7,
      price: 5,
      people: 1,
      quantity: 70,
      slang: 'geladinho-gourmet',
      description:
        'Geladinho gourmet recheado com um creme especial e coberto com raspas de chocolate ou creme de chocolate',
    },
  ],
  flavors: [
    { name: 'Morango com Nutella', price: 5 },
    { name: 'Ninho com Nutella', price: 5 },
    { name: 'Paçoca', price: 5 },
    { name: 'Oreo', price: 5 },
  ],
}
