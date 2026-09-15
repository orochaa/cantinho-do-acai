import { useProductPersonalization } from '@/hooks/use-product-personalization';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it } from 'vitest';

interface TestGroups {
  toppings: {
    type: 'multiple';
    options: Array<{ name: string }>;
    countLimit: number;
  };
}

const firstProduct: Product = {
  img: '/first.png',
  name: 'First',
  description: '',
  slang: 'first',
  fullPrice: 10,
  price: 10,
  people: 1,
};

const secondProduct: Product = {
  ...firstProduct,
  img: '/second.png',
  name: 'Second',
  slang: 'second',
};

const firstGroups: TestGroups = {
  toppings: {
    type: 'multiple',
    options: [{ name: 'First topping' }],
    countLimit: 1,
  },
};

const secondGroups: TestGroups = {
  toppings: {
    type: 'multiple',
    options: [{ name: 'Second topping' }],
    countLimit: 1,
  },
};

function PersonalizationProbe(props: {
  product: Product;
  groups: TestGroups;
}): React.JSX.Element {
  const personalization = useProductPersonalization(
    props.product,
    props.groups,
  );
  const option = personalization.groups.toppings.options[0];

  return (
    <div>
      <output>
        {option?.name}:{option?.count}
      </output>
      <button
        type="button"
        onClick={() =>
          personalization.dispatch({
            type: 'add',
            group: 'toppings',
            option: option ?? { name: '' },
          })
        }>
        add
      </button>
      <button
        type="button"
        onClick={() =>
          personalization.dispatch({
            type: 'remove',
            group: 'toppings',
            option: option ?? { name: '' },
          })
        }>
        remove
      </button>
    </div>
  );
}

let activeRoot: Root | undefined;

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeRoot = undefined;
  document.body.innerHTML = '';
});

describe(useProductPersonalization.name, () => {
  it('should add and remove options from the current product', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    await act(async () => {
      activeRoot?.render(
        <PersonalizationProbe
          product={firstProduct}
          groups={firstGroups}
        />,
      );
    });
    const addButton = container.querySelector<HTMLButtonElement>('button');
    const removeButton =
      container.querySelectorAll<HTMLButtonElement>('button')[1];

    await act(async () => addButton?.click());
    expect(container.querySelector('output')?.textContent).toBe(
      'First topping:1',
    );

    await act(async () => removeButton?.click());
    expect(container.querySelector('output')?.textContent).toBe(
      'First topping:0',
    );
  });

  it('should reset the previous product state when the product changes', async () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    await act(async () => {
      activeRoot?.render(
        <PersonalizationProbe
          product={firstProduct}
          groups={firstGroups}
        />,
      );
    });
    const addButton = container.querySelector<HTMLButtonElement>('button');
    await act(async () => addButton?.click());
    expect(container.querySelector('output')?.textContent).toBe(
      'First topping:1',
    );

    await act(async () => {
      activeRoot?.render(
        <PersonalizationProbe
          product={secondProduct}
          groups={secondGroups}
        />,
      );
      await Promise.resolve();
    });
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(container.querySelector('output')?.textContent).toBe(
      'Second topping:0',
    );
  });
});
