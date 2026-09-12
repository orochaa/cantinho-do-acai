import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { GeladinhoPage } from './geladinho';

type GeladinhoScenario =
  | 'overview'
  | 'main-selection'
  | 'validation'
  | 'quantity'
  | 'maximum-selection'
  | 'add-to-cart';

interface GeladinhoStoryProps {
  scenario: GeladinhoScenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const assertOptionLimitReached = (label: string): void => {
  const optionButton = findButton(label);
  const optionRow = optionButton?.parentElement;
  const addButton = optionRow?.querySelector<HTMLButtonElement>(
    'button[title="Adicionar"]',
  );

  if (!addButton?.disabled) {
    throw new Error(`The ${label} selection limit is not reflected in the UI`);
  }
};

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook fixtures live with the story.
function GeladinhoStory(props: GeladinhoStoryProps): React.JSX.Element {
  useEffect(() => {
    if (
      props.scenario !== 'main-selection' &&
      props.scenario !== 'quantity' &&
      props.scenario !== 'maximum-selection' &&
      props.scenario !== 'validation' &&
      props.scenario !== 'add-to-cart'
    ) {
      return;
    }

    const selectionTimer = window.setTimeout(() => {
      if (props.scenario === 'validation') {
        findButton('Adicionar ao Pedido')?.click();
        return;
      }

      findButton('Maracujá com Nutella')?.click();

      if (props.scenario === 'quantity') {
        findButton('Maracujá com Nutella')?.click();
      }

      if (props.scenario === 'maximum-selection') {
        for (let i = 0; i < 21; i += 1) {
          findButton('Maracujá com Nutella')?.click();
        }
        window.setTimeout(
          () => assertOptionLimitReached('Maracujá com Nutella'),
          0,
        );
      }
    }, 150);

    const addToCartTimer =
      props.scenario === 'add-to-cart'
        ? window.setTimeout(() => {
            findButton('Adicionar ao Pedido')?.click();
          }, 350)
        : undefined;

    return () => {
      window.clearTimeout(selectionTimer);
      if (addToCartTimer !== undefined) {
        window.clearTimeout(addToCartTimer);
      }
    };
  }, [props.scenario]);

  return <GeladinhoPage />;
}

const meta = {
  title: 'Pages/Geladinho',
  component: GeladinhoStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof GeladinhoStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { scenario: 'overview' },
};

export const MainSelection: Story = {
  args: { scenario: 'main-selection' },
  parameters: {
    docs: {
      description: {
        story: 'Select a flavor and inspect its quantity and updated total.',
      },
    },
  },
};

export const Validation: Story = {
  args: { scenario: 'validation' },
  parameters: {
    docs: {
      description: {
        story: 'Attempt to add the product without selecting a flavor.',
      },
    },
  },
};

export const FlavorQuantityControls: Story = {
  args: { scenario: 'quantity' },
  parameters: {
    docs: {
      description: {
        story: 'Select the same flavor twice to inspect its count control.',
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
        story: 'Select a flavor and add the configured Geladinho to the order.',
      },
    },
  },
};
