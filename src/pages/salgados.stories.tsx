import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { SalgadosPage } from './salgados';

type SalgadosScenario =
  | 'default'
  | 'validation'
  | 'complement-selection'
  | 'sauce-selection'
  | 'selection-and-quantity'
  | 'add-to-cart'
  | 'maximum-selection';

interface SalgadosStoryProps {
  scenario: SalgadosScenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const findOrderQuantityButton = (): HTMLButtonElement | undefined =>
  findButton(
    'Adicionar ao Pedido',
  )?.parentElement?.querySelector<HTMLButtonElement>(
    'button[title="Adicionar"]',
  ) ?? undefined;

const assertOptionLimitReached = (label: string): void => {
  const optionButton = findButton(label);
  const addButton =
    optionButton?.parentElement?.querySelector<HTMLButtonElement>(
      'button[title="Adicionar"]',
    );

  if (!addButton?.disabled) {
    throw new Error(
      'The complement selection limit is not reflected in the UI',
    );
  }
};

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook fixture.
function SalgadosStory(props: SalgadosStoryProps): React.JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (props.scenario === 'default') {
        return;
      }

      if (props.scenario === 'validation') {
        findButton('Adicionar ao Pedido')?.click();
        return;
      }

      if (
        props.scenario === 'complement-selection' ||
        props.scenario === 'selection-and-quantity' ||
        props.scenario === 'add-to-cart' ||
        props.scenario === 'maximum-selection'
      ) {
        findButton('Rissoles de Carne')?.click();
      }

      if (
        props.scenario === 'sauce-selection' ||
        props.scenario === 'selection-and-quantity' ||
        props.scenario === 'add-to-cart'
      ) {
        findButton('Molho de Catupiri')?.click();
      }

      if (props.scenario === 'selection-and-quantity') {
        window.setTimeout(() => findOrderQuantityButton()?.click(), 0);
      }

      if (props.scenario === 'maximum-selection') {
        for (let i = 0; i < 10; i += 1) {
          findButton('Rissoles de Carne')?.click();
        }
        window.setTimeout(
          () => assertOptionLimitReached('Rissoles de Carne'),
          0,
        );
      }

      if (props.scenario === 'add-to-cart') {
        window.setTimeout(
          () => findButton('Adicionar ao Pedido')?.click(),
          150,
        );
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [props.scenario]);

  return <SalgadosPage />;
}

const meta = {
  title: 'Pages/Salgados',
  component: SalgadosStory,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof SalgadosStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { scenario: 'default' } };

export const Validation: Story = {
  args: { scenario: 'validation' },
  parameters: {
    docs: {
      description: { story: 'Try adding without selecting snacks and sauce.' },
    },
  },
};

export const ComplementSelection: Story = {
  args: { scenario: 'complement-selection' },
  parameters: {
    docs: {
      description: {
        story: 'Select a snack and display its selected quantity.',
      },
    },
  },
};

export const SauceSelection: Story = {
  args: { scenario: 'sauce-selection' },
  parameters: {
    docs: {
      description: { story: 'Select a sauce and display the selected option.' },
    },
  },
};

export const SelectionAndQuantity: Story = {
  args: { scenario: 'selection-and-quantity' },
  parameters: {
    docs: {
      description: {
        story: 'Choose snacks and sauce, then adjust the quantity.',
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
          'Exercise the 10-snack limit and keep the excess selection blocked.',
      },
    },
  },
};

export const AddToCart: Story = {
  args: { scenario: 'add-to-cart' },
  parameters: {
    docs: {
      description: { story: 'Configure the options and add the order.' },
    },
  },
};
