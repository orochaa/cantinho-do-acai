import { ACAI_EXTRA } from '@/domain/categories/acai-extra';
import { slang } from '@/domain/format';

export interface ProductOptionGroup {
  title: string;
  description: string;
  selection?: 'single' | 'multiple';
  discountProductPrice?: boolean;
  required?: string;
  options: Array<Option>;
}

export type SorveteProduct = Product & {
  count: number;
  optionGroups: Array<ProductOptionGroup>;
};

const options = (
  items: Array<Pick<Option, 'name' | 'img' | 'price'>>,
  count = 1,
): Array<Option> => items.map(item => ({ ...item, count }));

const requiredFlavor = 'Escolha pelo menos um sabor.';

export const sorveteCategory: Category<SorveteProduct> = {
  slang: 'sorvetes',
  quickAdd: true,
  description:
    'Potes de sorvete, sobremesas geladas e marmitas para refrescar qualquer momento.',
  products: [
    {
      name: 'Pote de Sorvete 1 Litro',
      img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171627_JON8_i.jpg',
      count: 4,
      price: 27.5,
      fullPrice: 27.5,
      optionGroups: [
        {
          title: 'Sabor de Sorvete de 1 Litro',
          description: 'Escolha o sabor do seu sorvete.',
          discountProductPrice: true,
          required: requiredFlavor,
          options: options([
            {
              name: 'Sorvete Napolitano',
              price: 27.5,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171839_7F37_i.jpg',
            },
          ]),
        },
      ],
    },
    {
      name: 'Pote de Sorvete 2 Litros',
      img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171630_R0PF_i.jpg',
      count: 8,
      price: 39.9,
      fullPrice: 39.9,
      optionGroups: [
        {
          title: 'Sabor de Sorvete de 2 Litros',
          description: 'Escolha um ou mais sabores para o seu sorvete.',
          discountProductPrice: true,
          required: requiredFlavor,
          options: options([
            {
              name: 'Sorvete Napolitano',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171840_7BI3_i.jpg',
            },
            {
              name: 'Abacaxi',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171840_80R7_i.jpg',
            },
            {
              name: 'Uva e Baunilha',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171841_IBH2_i.jpg',
            },
            {
              name: 'Creme',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171841_473I_i.jpg',
            },
            {
              name: 'Chocolate e Flocos',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171842_STR4_i.jpg',
            },
            {
              name: 'Flocos',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171842_K821_i.jpg',
            },
          ]),
        },
      ],
    },
    {
      name: 'Sobremesa Gelada 1,5 Litros',
      img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171617_B5G5_i.jpg',
      count: 6,
      price: 39.9,
      fullPrice: 39.9,
      optionGroups: [
        {
          title: 'Sabores de sobremesa gelada',
          description: 'Escolha um ou mais sabores.',
          discountProductPrice: true,
          required: requiredFlavor,
          options: options([
            {
              name: 'Torta de Morango e Nata',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171845_624I_i.jpg',
            },
            {
              name: 'Churros',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171844_41T6_i.jpg',
            },
            {
              name: 'Pavê',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171844_83PX_i.jpg',
            },
            {
              name: 'Nega Maluca',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171844_K25Y_i.jpg',
            },
            {
              name: 'Mousse de Maracujá',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171844_WC0D_i.jpg',
            },
            {
              name: 'Chico Balanceado',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171844_W37G_i.jpg',
            },
            {
              name: 'Paçoca',
              price: 39.9,
              img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171845_T1DN_i.jpg',
            },
          ]),
        },
      ],
    },
    {
      name: 'Marmita de Sorvete',
      img: 'https://static-images.ifood.com.br/pratos/e98d3812-d175-4664-ae77-97f266bc601a/202610171655_Y50P_i.jpg',
      count: 2,
      price: 35,
      fullPrice: 35,
      optionGroups: [
        {
          title: 'Sabor de Sorvete',
          description: 'Escolha um ou mais sabores.',
          selection: 'single' as const,
          required: requiredFlavor,
          options: options([
            { name: 'Sorvete de Morango' },
            { name: 'Sorvete de Chocolate' },
            { name: 'Sorvete de Creme' },
            { name: 'Sorvete de Flocos' },
            { name: 'Sorvete Napolitano' },
            { name: 'Sorvete de Iogurte Grego com Morango' },
          ]),
        },
        {
          title: 'Calda',
          description: 'Adicione uma ou mais caldas, se desejar.',
          selection: 'single' as const,
          options: options([
            {
              name: 'Calda de Morango',
              img: ACAI_EXTRA['Calda de Morango'].img,
            },
            {
              name: 'Calda de Chocolate',
              img: ACAI_EXTRA['Calda de Chocolate'].img,
            },
          ]),
        },
      ],
    },
  ].map(product => ({
    ...product,
    description: 'Uma sobremesa gelada para compartilhar e aproveitar.',
    people: product.count,
    slang: slang(product.name),
    acceptsObservation: false,
  })),
};
