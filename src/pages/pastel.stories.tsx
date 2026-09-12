import { PastelPage } from '@/pages/pastel';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

type PastelScenario = 'default' | 'size-selection' | 'quantity' | 'add-to-cart';

interface PastelStoryProps {
  scenario: PastelScenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const findOrderQuantityButton = (): HTMLButtonElement | undefined =>
  findButton('Adicionar ao Pedido')?.parentElement?.querySelector(
    'button[title="Adicionar"]',
  ) ?? undefined;

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook fixture.
function PastelStory(props: PastelStoryProps): React.JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (props.scenario === 'default') {
        return;
      }

      if (props.scenario === 'size-selection') {
        findButton('Pastel Grande')?.click();
      }

      if (props.scenario === 'quantity') {
        findOrderQuantityButton()?.click();
      }

      if (props.scenario === 'add-to-cart') {
        findButton('Pastel Grande')?.click();
        findButton('Adicionar ao Pedido')?.click();
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [props.scenario]);

  return <PastelPage />;
}

const meta = {
  title: 'Pages/Pastel',
  component: PastelStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PastelStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { scenario: 'default' },
};

export const SizeSelection: Story = {
  args: { scenario: 'size-selection' },
  parameters: {
    docs: {
      description: { story: 'Choose a size and inspect the effective price.' },
    },
  },
};

export const OrderQuantityControls: Story = {
  args: { scenario: 'quantity' },
  parameters: {
    docs: {
      description: {
        story: 'Adjust the quantity before adding the pastel.',
      },
    },
  },
};

export const AddToCart: Story = {
  args: { scenario: 'add-to-cart' },
  parameters: {
    docs: {
      description: {
        story: 'Choose a size and add the pastel to the order.',
      },
    },
  },
};
