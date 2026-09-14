import { BebidaPage } from '@/pages/bebida';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

type BebidaScenario =
  | 'default'
  | 'flavor-selection'
  | 'validation'
  | 'flavor-quantity'
  | 'maximum-selection'
  | 'add-to-cart';

interface BebidaStoryProps {
  scenario: BebidaScenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const findOptionButton = (optionName: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(optionName),
  );

const assertOptionLimitReached = (label: string): void => {
  const optionButton = findOptionButton(label);
  const optionRow = optionButton?.parentElement;
  const addButton = optionRow?.querySelector<HTMLButtonElement>(
    'button[title="Adicionar"]',
  );

  if (!addButton?.disabled) {
    throw new Error(`The ${label} selection limit is not reflected in the UI`);
  }
};

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook fixtures live with the story.
function BebidaStory(props: BebidaStoryProps): React.JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (props.scenario === 'flavor-selection') {
        findOptionButton('Coca-Cola 600ml')?.click();
      }

      if (props.scenario === 'validation') {
        findButton('Adicionar ao pedido')?.click();
      }

      if (props.scenario === 'flavor-quantity') {
        findOptionButton('Guaraná 600ml')?.click();
        findOptionButton('Guaraná 600ml')?.click();
      }

      if (props.scenario === 'maximum-selection') {
        for (let i = 0; i < 21; i += 1) {
          findOptionButton('Coca-Cola 600ml')?.click();
        }
        window.setTimeout(() => assertOptionLimitReached('Coca-Cola 600ml'), 0);
      }

      if (props.scenario === 'add-to-cart') {
        findOptionButton('Sprite 600ml')?.click();
        window.setTimeout(() => {
          findButton('Adicionar ao pedido')?.click();
        }, 150);
      }
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [props.scenario]);

  return <BebidaPage />;
}

const meta = {
  title: 'Pages/Bebida',
  component: BebidaStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof BebidaStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { scenario: 'default' },
  parameters: {
    docs: {
      description: {
        story:
          'Display the static catalog and its available ordering controls.',
      },
    },
  },
};

export const FlavorSelection: Story = {
  args: { scenario: 'flavor-selection' },
  parameters: {
    docs: {
      description: {
        story: 'Select a drink flavor and update its selected quantity.',
      },
    },
  },
};

export const Validation: Story = {
  args: { scenario: 'validation' },
  parameters: {
    docs: {
      description: {
        story:
          'Try adding without selecting a flavor to display the required-choice validation.',
      },
    },
  },
};

export const FlavorQuantityControls: Story = {
  args: { scenario: 'flavor-quantity' },
  parameters: {
    docs: {
      description: {
        story:
          'Add two units of the same flavor and display its quantity control.',
      },
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
        story: 'Choose a flavor and add the drink to the cart.',
      },
    },
  },
};
