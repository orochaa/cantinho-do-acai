export const bebidaCategory: Category<
  Product,
  { flavors: { name: string; price: number }[] }
> = {
  path: 'bebidas',
  description: 'Bebidas variadas para acompanhar seu lanche ou sobremesa.',
  products: [
    {
      img: '/img/bebidas.png',
      name: 'Refrigerantes',
      fullPrice: 10,
      price: 10,
      people: 1,
      slang: 'refrigerantes',
      description: 'Bebidas variadas para acompanhar seu lanche ou sobremesa',
    },
  ],
  flavors: [
    { name: 'Coca-Cola 600ml', price: 10 },
    { name: 'Coca-Cola Zero 600ml', price: 10 },
    { name: 'Guaraná 600ml', price: 10 },
    { name: 'Sprite 600ml', price: 10 },
  ],
}
