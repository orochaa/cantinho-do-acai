import type { Meta, StoryObj } from '@storybook/react-vite';
import { CartPickupNotice } from './cart-pickup-notice';

const meta = {
  title: 'Pages/Cart/Components/CartPickupNotice',
  component: CartPickupNotice,
  parameters: { layout: 'centered' },
} satisfies Meta<typeof CartPickupNotice>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
