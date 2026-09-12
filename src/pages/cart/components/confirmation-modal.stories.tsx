import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfirmationModal } from './confirmation-modal';

const meta = {
  title: 'Pages/Cart/Components/ConfirmationModal',
  component: ConfirmationModal,
  parameters: { layout: 'fullscreen' },
  args: {
    goToWhatsappLink: 'https://example.com/whatsapp',
    setModalOpen: () => {},
  },
} satisfies Meta<typeof ConfirmationModal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
