import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { Route, Routes, useNavigate } from 'react-router';
import { FelicidadePage } from './felicidade';

type Scenario =
  | 'default'
  | 'selection'
  | 'validation'
  | 'quantity'
  | 'add-to-cart';

interface FelicidadeStoryProps {
  scenario: Scenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const findButtonByTitle = (title: string): HTMLButtonElement | undefined =>
  document.querySelector<HTMLButtonElement>(`button[title="${title}"]`) ??
  undefined;

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook scenarios live with the page story.
function FelicidadeStory(props: FelicidadeStoryProps): React.JSX.Element {
  const navigate = useNavigate();

  useEffect(() => {
    const slug =
      props.scenario === 'selection'
        ? 'copo-da-felicidade-de-kinder-bueno'
        : 'copo-da-felicidade-de-morango';

    navigate(`/felicidade/${slug}`, { replace: true });
  }, [navigate, props.scenario]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (props.scenario === 'quantity') {
        findButtonByTitle('Adicionar')?.click();
        findButtonByTitle('Adicionar')?.click();
      }

      if (props.scenario === 'validation' || props.scenario === 'add-to-cart') {
        findButton('Adicionar ao Pedido')?.click();
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [props.scenario]);

  return (
    <Routes>
      <Route
        path="felicidade/:slang"
        element={<FelicidadePage />}
      />
    </Routes>
  );
}

const meta = {
  title: 'Pages/Felicidade',
  component: FelicidadeStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof FelicidadeStory>;

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
          'Display a different Copo da Felicidade product selected by the route.',
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
          'This page has no required personalization and can be added immediately.',
      },
    },
  },
};

export const OrderQuantityControls: Story = {
  args: { scenario: 'quantity' },
  parameters: {
    docs: {
      description: {
        story: 'Increase the quantity to three and update the order total.',
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
          'Add the Copo da Felicidade to the cart and display the success confirmation.',
      },
    },
  },
};
