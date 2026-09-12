import type { CartItem } from '@/context/cart-provider';
import { useCart } from '@/context/cart-provider';
import { CartPage } from '@/pages/cart/cart';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

const product: Product = {
  description: 'Açaí tradicional com complementos.',
  fullPrice: 24,
  img: '/img/acai-300.png',
  name: 'Açaí 300ml',
  people: 1,
  price: 18,
  slang: 'acai-300ml',
};

const cartItem: Omit<CartItem, 'id' | 'total'> = {
  count: 1,
  observation: 'Sem gelo',
  options: [{ name: 'Leite condensado', count: 1, price: 2 }],
  product,
};

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook fixtures live with the story.
function SeedCart(): null {
  const { cart, addCartEvent } = useCart();

  useEffect(() => {
    if (cart.length === 0) {
      addCartEvent({ type: 'add', item: cartItem });
    }
  }, [addCartEvent, cart.length]);

  return null;
}

type CheckoutScenario =
  | 'cart'
  | 'delivery'
  | 'payment'
  | 'validation'
  | 'confirmation';

interface CheckoutStoryProps {
  scenario: CheckoutScenario;
}

const findButton = (label: string): HTMLButtonElement | undefined =>
  Array.from(document.querySelectorAll('button')).find(button =>
    button.textContent?.includes(label),
  );

const setInputValue = (id: string, value: string): void => {
  const input = document.querySelector<HTMLInputElement>(id);
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;

  if (input && setter) {
    setter.call(input, value);
    input.dispatchEvent(new Event('input', { bubbles: true }));
  }
};

// biome-ignore lint/style/useComponentExportOnlyModules: Storybook fixtures live with the story.
function CheckoutStory(props: CheckoutStoryProps): React.JSX.Element {
  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (props.scenario === 'delivery') {
        findButton('Entrega (com taxa de entrega)')?.click();
      }

      if (props.scenario === 'payment') {
        findButton('Dinheiro')?.click();
      }

      if (props.scenario === 'validation') {
        findButton('Confirmar Pedido')?.click();
      }

      if (props.scenario === 'confirmation') {
        setInputValue('#client-name', 'Maria');
        findButton('Confirmar Pedido')?.click();
      }
    }, 150);

    return () => {
      window.clearTimeout(timer);
    };
  }, [props.scenario]);

  return (
    <>
      <SeedCart />
      <CartPage />
    </>
  );
}

const meta = {
  title: 'Pages/Cart',
  component: CheckoutStory,
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta<typeof CheckoutStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Cart: Story = {
  name: 'Cart items',
  args: { scenario: 'cart' },
};

export const Delivery: Story = {
  name: 'Delivery address',
  args: { scenario: 'delivery' },
  parameters: {
    docs: {
      description: { story: 'Select delivery to inspect the CEP form.' },
    },
  },
};

export const Payment: Story = {
  name: 'Payment options',
  args: { scenario: 'payment' },
  parameters: {
    docs: {
      description: { story: 'Select cash to inspect payment and change.' },
    },
  },
};

export const Validation: Story = {
  name: 'Validation feedback',
  args: { scenario: 'validation' },
  parameters: {
    docs: {
      description: { story: 'Confirm without a name to inspect validation.' },
    },
  },
};

export const Confirmation: Story = {
  name: 'Confirmation modal',
  args: { scenario: 'confirmation' },
  parameters: {
    docs: {
      description: {
        story: 'Fill the name and confirm to inspect the WhatsApp modal.',
      },
    },
  },
};
