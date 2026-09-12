import type { Meta, StoryObj } from '@storybook/react-vite';
import { CashPayment } from './cash-payment';

const meta = {
  title: 'Pages/Cart/Components/CashPayment',
  component: CashPayment,
  parameters: { layout: 'centered' },
  args: {
    cashValue: '',
    change: 0,
    orderTotal: 38,
    setCashValue: () => {},
  },
} satisfies Meta<typeof CashPayment>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const WithChange: Story = {
  args: { cashValue: 'R$ 50,00', change: 12 },
};
