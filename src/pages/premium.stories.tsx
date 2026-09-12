import { PremiumPage } from '@/pages/premium';
import type { Decorator, Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router';

type PremiumScenario =
  | 'default'
  | 'validation'
  | 'selection-and-quantity'
  | 'observation'
  | 'add-to-cart';

interface PremiumStoryProps {
  scenario: PremiumScenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const findOrderQuantityButton = (): HTMLButtonElement | undefined =>
  findButton('Adicionar ao Pedido')?.parentElement?.querySelector(
    'button[title="Adicionar"]',
  ) ?? undefined;

const setObservation = (value: string): void => {
  const textarea = document.querySelector<HTMLTextAreaElement>('#observation');

  if (!textarea) {
    return;
  }

  const setter = Object.getOwnPropertyDescriptor(
    HTMLTextAreaElement.prototype,
    'value',
  )?.set;
  setter?.call(textarea, value);
  textarea.dispatchEvent(new Event('input', { bubbles: true }));
};

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook fixture.
function PremiumStory(props: PremiumStoryProps): React.JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (props.scenario === 'default') {
        return;
      }

      if (props.scenario === 'validation') {
        findButton('Adicionar ao Pedido')?.click();
        return;
      }

      findButton('Fini banana')?.click();

      if (props.scenario === 'selection-and-quantity') {
        findOrderQuantityButton()?.click();
      }

      if (props.scenario === 'observation') {
        setObservation('Sem guardanapo, por favor.');
      }

      if (props.scenario === 'add-to-cart') {
        window.setTimeout(() => {
          findButton('Adicionar ao Pedido')?.click();
        }, 150);
      }
    }, 150);

    return () => window.clearTimeout(timer);
  }, [props.scenario]);

  return <PremiumPage />;
}

const withFiniFestRoute: Decorator = Story => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.pathname !== '/premium/fini-fest') {
      navigate('/premium/fini-fest', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <Routes>
      <Route
        path="/premium/:slang"
        element={<Story />}
      />
    </Routes>
  );
};

const meta = {
  title: 'Pages/Premium',
  component: PremiumStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof PremiumStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { scenario: 'default' },
};

export const Validation: Story = {
  args: { scenario: 'validation' },
  decorators: [withFiniFestRoute],
  parameters: {
    docs: { description: { story: 'Try adding without selecting the Fini.' } },
  },
};

export const SelectionAndQuantity: Story = {
  args: { scenario: 'selection-and-quantity' },
  decorators: [withFiniFestRoute],
  parameters: {
    docs: {
      description: { story: 'Choose the Fini and adjust the quantity.' },
    },
  },
};

export const Observation: Story = {
  args: { scenario: 'observation' },
  decorators: [withFiniFestRoute],
  parameters: {
    docs: {
      description: {
        story: 'Enter an observation for the personalized product.',
      },
    },
  },
};

export const AddToCart: Story = {
  args: { scenario: 'add-to-cart' },
  decorators: [withFiniFestRoute],
  parameters: {
    docs: {
      description: {
        story: 'Select the Fini and add the personalized product to the order.',
      },
    },
  },
};
