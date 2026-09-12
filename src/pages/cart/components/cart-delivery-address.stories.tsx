import type { DeliveryAddress } from '@/lib/order';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { CartDeliveryAddress } from './cart-delivery-address';

const address: DeliveryAddress = {
  cep: '95000000',
  city: 'Caxias do Sul',
  neighborhood: 'Centro',
  state: 'RS',
  street: 'Rua Olinda de Almeida Lima',
};

const meta = {
  title: 'Pages/Cart/Components/CartDeliveryAddress',
  component: CartDeliveryAddress,
  parameters: { layout: 'centered' },
  args: {
    address: null,
    addressComplement: '',
    addressError: null,
    addressNumber: '',
    addressReference: '',
    cep: '',
    cepLoading: false,
    handleCepChange: async () => {},
    setAddressComplement: () => {},
    setAddressNumber: () => {},
    setAddressReference: () => {},
  },
} satisfies Meta<typeof CartDeliveryAddress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = {};

export const Loading: Story = {
  args: { cep: '95000000', cepLoading: true },
};

export const ErrorState: Story = {
  args: { cep: '95000000', addressError: 'CEP não encontrado.' },
};

export const Loaded: Story = {
  args: {
    address,
    addressNumber: '249',
    cep: '95000000',
  },
};
