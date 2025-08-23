export const bebidaCategory: Category<
  Product,
  { flavors: { name: string; price: number }[] }
> = {
  path: 'bebidas',
  products: [
    {
      img: '/img/bebidas.png',
      name: 'Refrigerantes',
      fullPrice: 7,
      price: 7,
      people: 1,
      slang: 'refrigerantes',
      description: 'Bebidas variadas para acompanhar seu lanche ou sobremesa',
    },
  ],
  flavors: [
    { name: 'Coca-Cola 600ml', price: 7 },
    { name: 'Coca-Cola Zero 600ml', price: 7 },
    { name: 'Guaraná 600ml', price: 7 },
    { name: 'Sprite 600ml', price: 7 },
  ],
}
