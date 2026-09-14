import { QuickAddDialog } from '@/components/quick-add-dialog';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent, within } from 'storybook/test';

const product: Product = {
  description: 'Produto demonstrativo para o fluxo de adição rápida.',
  fullPrice: 12,
  img: '/img/paleta/paleta.jpg',
  name: 'Paleta de Ninho com Nutella',
  people: 1,
  price: 10,
  quantity: 105,
  slang: 'paleta-de-ninho-com-nutella',
};

const steps = [
  {
    defaultOptionIndex: 0,
    description: 'Escolha uma opção antes de revisar o pedido.',
    id: 'size',
    options: [
      { name: 'Pequeno', price: -2 },
      { name: 'Grande', price: 2 },
    ],
    title: 'Qual tamanho você prefere?',
  },
] as const;

const largeOptionName = /Grande/;
const observationLabel = /Observação/;

type Scenario = 'default' | 'option' | 'dirty' | 'edit';

interface QuickAddStoryProps {
  scenario: Scenario;
}

function QuickAddStory(props: QuickAddStoryProps): React.JSX.Element {
  const editItem =
    props.scenario === 'edit'
      ? {
          id: 'story-item',
          count: 2,
          observation: 'Com carinho',
          options: [{ name: 'Grande', price: 2, count: 1 }],
          product,
          total: 24,
        }
      : undefined;

  return (
    <QuickAddDialog
      editItem={editItem}
      onClose={() => undefined}
      open
      product={product}
      steps={props.scenario === 'default' ? undefined : steps}
    />
  );
}

const meta = {
  title: 'Components/QuickAddDialog',
  component: QuickAddStory,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof QuickAddStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { scenario: 'default' } };
export const RequiredOption: Story = {
  args: { scenario: 'option' },
  play: async () => {
    const canvas = within(document.body);
    await userEvent.click(
      await canvas.findByRole('button', { name: largeOptionName }),
    );
  },
  parameters: {
    docs: { description: { story: 'Choose an option before reviewing.' } },
  },
};
export const DirtyDiscard: Story = {
  args: { scenario: 'dirty' },
  play: async () => {
    const canvas = within(document.body);
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Continuar' }),
    );
    await userEvent.type(
      await canvas.findByRole('textbox', { name: observationLabel }),
      'Sem guardanapo',
    );
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Fechar' }),
    );
  },
  parameters: {
    docs: { description: { story: 'A changed draft asks before discarding.' } },
  },
};
export const EditDraft: Story = {
  args: { scenario: 'edit' },
  play: async () => {
    const canvas = within(document.body);
    await userEvent.click(
      await canvas.findByRole('button', { name: 'Continuar' }),
    );
  },
  parameters: {
    docs: { description: { story: 'An existing cart item is hydrated.' } },
  },
};
