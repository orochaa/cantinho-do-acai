import type { Meta, StoryObj } from '@storybook/react-vite';
import { CartIdentification } from './cart-identification';

const meta = {
  title: 'Pages/Cart/Components/CartIdentification',
  component: CartIdentification,
  parameters: { layout: 'centered' },
  args: { clientName: '', setClientName: () => {} },
} satisfies Meta<typeof CartIdentification>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Filled: Story = {
  args: { clientName: 'Maria' },
};
