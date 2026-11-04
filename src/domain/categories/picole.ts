import type { ProductOptionGroup } from '@/domain/categories/sorvete';
import { slang } from '@/domain/format';

const requiredFlavor = 'Escolha pelo menos um sabor.';

export type PicoleProduct = Product & {
  optionGroups: Array<ProductOptionGroup>;
};

const optionGroup = (input: {
  title: string;
  description: string;
  names: Array<string>;
  price: number;
}): ProductOptionGroup => ({
  title: input.title,
  description: input.description,
  discountProductPrice: true,
  required: requiredFlavor,
  options: input.names.map(name => ({
    name,
    count: 1,
    price: input.price,
  })),
});

export const picoleCategory: Category<PicoleProduct> = {
  slang: 'picoles',
  quickAdd: true,
  description: 'Picolés de fruta e recheados para refrescar o seu dia.',
  products: [
    {
      name: 'Picolé de Fruta',
      img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171637_CET5_i.jpg',
      price: 5.5,
      fullPrice: 5.5,
      optionGroups: [
        optionGroup({
          title: 'Sabor de Picolé de Fruta',
          description: 'Escolha um ou mais sabores.',
          price: 5.5,
          names: ['Abacaxi', 'Limão', 'Uva', 'Morango', 'Maracujá'],
        }),
      ],
    },
    {
      name: 'Picolé Recheado',
      img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171644_U0OI_i.jpg',
      price: 7.5,
      fullPrice: 7.5,
      optionGroups: [
        optionGroup({
          title: 'Sabor de Picolé Recheado',
          description: 'Escolha um ou mais sabores.',
          price: 7.5,
          names: ['Torta Alemã'],
        }),
      ],
    },
  ].map(product => ({
    ...product,
    description: 'Picolé artesanal preparado com ingredientes selecionados.',
    people: 1,
    slang: slang(product.name),
    acceptsObservation: false,
  })),
};
