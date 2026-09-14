import type { CartItem } from '@/domain/cart';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CartItems } from './cart-items';

const cart: Array<CartItem> = [
  {
    id: 'acai-300',
    count: 2,
    observation: 'Sem gelo',
    options: [
      { name: 'Leite condensado', count: 1, price: 2 },
      { name: 'Banana', count: 1 },
    ],
    product: {
      description: 'Açaí tradicional.',
      fullPrice: 24,
      img: '/img/acai-300.png',
      name: 'Açaí 300ml',
      people: 1,
      price: 18,
      slang: 'acai-300ml',
    },
    total: 40,
  },
];

const meta = {
  title: 'Pages/Cart/Components/CartItems',
  component: CartItems,
  parameters: { layout: 'centered' },
  args: {
    cart,
    onRemove: () => {},
    onEdit: () => {},
  },
} satisfies Meta<typeof CartItems>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
