import { PaletaPage } from '@/pages/paleta';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

type PaletaScenario =
  | 'default'
  | 'validation'
  | 'selection-and-quantity'
  | 'add-to-cart'
  | 'maximum-selection';

interface PaletaStoryProps {
  scenario: PaletaScenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const assertOptionLimitReached = (label: string): void => {
  const optionButton = findButton(label);
  const addButton =
    optionButton?.parentElement?.querySelector<HTMLButtonElement>(
      'button[title="Adicionar"]',
    );

  if (!addButton?.disabled) {
    throw new Error('The flavor selection limit is not reflected in the UI');
  }
};

function PaletaStory(props: PaletaStoryProps): React.JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      const flavor = 'Morango com Leite Condensado';

      if (props.scenario === 'validation') {
        findButton('Adicionar ao pedido')?.click();
        return;
      }

      if (props.scenario === 'default') {
        return;
      }

      findButton(flavor)?.click();

      if (props.scenario === 'selection-and-quantity') {
        findButton(flavor)?.click();
      }

      if (props.scenario === 'maximum-selection') {
        for (let i = 0; i < 20; i += 1) {
          findButton(flavor)?.click();
        }
        window.setTimeout(() => assertOptionLimitReached(flavor), 0);
      }

      if (props.scenario === 'add-to-cart') {
        window.setTimeout(() => {
          findButton('Adicionar ao pedido')?.click();
        }, 150);
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [props.scenario]);

  return <PaletaPage />;
}

const meta = {
  title: 'Pages/Paleta',
  component: PaletaStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PaletaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { scenario: 'default' },
};

export const Validation: Story = {
  args: { scenario: 'validation' },
  parameters: {
    docs: { description: { story: 'Try adding without selecting a flavor.' } },
  },
};

export const SelectionAndQuantity: Story = {
  args: { scenario: 'selection-and-quantity' },
  parameters: {
    docs: {
      description: { story: 'Choose a flavor and adjust its quantity.' },
    },
  },
};

export const MaximumFlavorSelection: Story = {
  args: { scenario: 'maximum-selection' },
  parameters: {
    docs: {
      description: {
        story:
          'Exercise the 20-flavor limit and keep the excess selection blocked.',
      },
    },
  },
};

export const AddToCart: Story = {
  args: { scenario: 'add-to-cart' },
  parameters: {
    docs: {
      description: {
        story: 'Configure a flavor and add the paleta to the order.',
      },
    },
  },
};
