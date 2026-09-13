import { useCart } from '@/context/cart-provider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect } from 'react';

type Scenario = 'empty' | 'populated' | 'search' | 'matching' | 'no-results';

const fixture = {
  count: 2,
  observation: '',
  options: [],
  product: {
    description: '',
    fullPrice: 15,
    img: '/img/pastel/pastel-de-frango.avif',
    name: 'Pastel de Frango',
    people: 1,
    price: 15,
    slang: 'pastel-de-frango',
  },
};

export function NavigationStory(props: {
  scenario: Scenario;
}): React.JSX.Element {
  const { cart, addCartEvent } = useCart();

  useEffect(() => {
    if (
      (props.scenario === 'populated' || props.scenario === 'matching') &&
      cart.length === 0
    ) {
      addCartEvent({ type: 'add', item: fixture });
    }
  }, [addCartEvent, cart.length, props.scenario]);

  useEffect(() => {
    if (!['search', 'matching', 'no-results'].includes(props.scenario)) {
      return;
    }
    let inputTimer: number | undefined;
    const timer = window.setTimeout(() => {
      document
        .querySelector<HTMLButtonElement>('button[aria-label="Buscar"]')
        ?.click();
      if (props.scenario !== 'search') {
        inputTimer = window.setTimeout(() => {
          const input =
            document.querySelector<HTMLInputElement>('#menu-search-input');
          const setter = Object.getOwnPropertyDescriptor(
            HTMLInputElement.prototype,
            'value',
          )?.set;
          setter?.call(
            input,
            props.scenario === 'matching' ? 'pastéis' : 'xyz',
          );
          input?.dispatchEvent(new Event('input', { bubbles: true }));
        }, 0);
      }
    }, 100);
    return () => {
      window.clearTimeout(timer);
      if (inputTimer !== undefined) {
        window.clearTimeout(inputTimer);
      }
    };
  }, [props.scenario]);

  return (
    <div className="min-h-screen p-8 text-white">Conteúdo do cardápio</div>
  );
}

const meta = {
  title: 'Components/AppContentShell',
  component: NavigationStory,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof NavigationStory>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Empty: Story = { args: { scenario: 'empty' } };
export const Populated: Story = { args: { scenario: 'populated' } };
export const SearchInitial: Story = { args: { scenario: 'search' } };
export const SearchMatching: Story = { args: { scenario: 'matching' } };
export const SearchNoResults: Story = { args: { scenario: 'no-results' } };
