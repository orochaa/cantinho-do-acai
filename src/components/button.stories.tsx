import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './button';

const meta = {
  title: 'Components/Button',
  component: Button,
  args: {
    children: 'Adicionar ao pedido',
    variant: 'confirm',
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Confirm: Story = {};

export const Cancel: Story = {
  args: {
    children: 'Cancelar',
    variant: 'cancel',
  },
};
