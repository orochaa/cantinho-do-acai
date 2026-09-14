import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { AcaiPage } from './acai';

type AcaiScenario =
  | 'default'
  | 'selection'
  | 'validation'
  | 'quantity'
  | 'maximum-selection'
  | 'maximum-extras-selection'
  | 'add-to-cart';

interface AcaiStoryProps {
  scenario: AcaiScenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const findOrderButton = (): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes('Adicionar ao pedido'),
  );

const findOrderQuantityButton = (): HTMLButtonElement | undefined =>
  findOrderButton()?.parentElement?.querySelector<HTMLButtonElement>(
    'button[title="Aumentar quantidade"]',
  ) ?? undefined;

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

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook scenario fixture.
function AcaiStory(props: AcaiStoryProps): React.JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (props.scenario === 'selection') {
        findButton('Cupuaçu')?.click();
      }

      if (props.scenario === 'validation') {
        findOrderButton()?.click();
      }

      if (props.scenario === 'quantity') {
        findOrderQuantityButton()?.click();
        findOrderQuantityButton()?.click();
      }

      if (props.scenario === 'maximum-selection') {
        for (let i = 0; i < 8; i += 1) {
          findButton('Banana')?.click();
        }
        window.setTimeout(() => assertOptionLimitReached('Banana'), 0);
      }

      if (props.scenario === 'maximum-extras-selection') {
        for (let i = 0; i < 11; i += 1) {
          findButton('Kiwi')?.click();
        }
        window.setTimeout(() => assertOptionLimitReached('Kiwi'), 0);
      }

      if (props.scenario === 'add-to-cart') {
        findButton('Morango')?.click();
        findButton('Kiwi')?.click();
        findOrderButton()?.click();
      }
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [props.scenario]);

  return <AcaiPage />;
}

const meta = {
  title: 'Pages/Açaí',
  component: AcaiStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof AcaiStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { scenario: 'default' },
};

export const MainSelection: Story = {
  args: { scenario: 'selection' },
  parameters: {
    docs: {
      description: {
        story:
          'Select Cupuaçu in the main group and display the selected option.',
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
          'Try adding without required choices. This page permits the initial configuration because it has no required groups.',
      },
    },
  },
};

export const OrderQuantityControls: Story = {
  args: { scenario: 'quantity' },
  parameters: {
    docs: {
      description: {
        story: 'Increase the quantity to three units and update the total.',
      },
    },
  },
};

export const MaximumComplementSelection: Story = {
  args: { scenario: 'maximum-selection' },
  parameters: {
    docs: {
      description: {
        story:
          'Exercise the complement limit and keep the excess selection blocked.',
      },
    },
  },
};

export const MaximumExtraSelection: Story = {
  args: { scenario: 'maximum-extras-selection' },
  parameters: {
    docs: {
      description: {
        story:
          'Exercise the extra limit and keep the excess selection blocked.',
      },
    },
  },
};

export const AddToCart: Story = {
  args: { scenario: 'add-to-cart' },
  parameters: {
    docs: {
      description: {
        story:
          'Select Morango and Kiwi, then add the personalized item to the cart.',
      },
    },
  },
};
