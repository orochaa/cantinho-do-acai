import { MultipleOptionsSelector } from '@/components/multiple-options-selector';
import { act } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

let activeRoot: Root | undefined;

afterEach(() => {
  activeRoot?.unmount();
  activeRoot = undefined;
  document.body.innerHTML = '';
});

const createState = (countTotal = 0) => ({
  type: 'multiple' as const,
  countLimit: 2,
  countTotal,
  options: [{ name: 'Morango', count: countTotal }],
});

describe(MultipleOptionsSelector.name, () => {
  it('should dispatch add and remove events from quantity controls', () => {
    const dispatchEvent = vi.fn();
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <MultipleOptionsSelector
          title="Sabores"
          ctx={createState(1)}
          dispatchEvent={dispatchEvent}
        />,
      );
    });

    const removeButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Remover Morango"]',
    );
    const addButton = container.querySelector<HTMLButtonElement>(
      'button[aria-label="Adicionar Morango"]',
    );

    act(() => removeButton?.click());
    act(() => addButton?.click());

    expect(dispatchEvent).toHaveBeenNthCalledWith(1, {
      type: 'remove',
      option: { name: 'Morango', count: 1 },
    });
    expect(dispatchEvent).toHaveBeenNthCalledWith(2, {
      type: 'add',
      option: { name: 'Morango', count: 1 },
    });
  });

  it('should disable add controls at the count limit', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <MultipleOptionsSelector
          title="Sabores"
          ctx={createState(2)}
          dispatchEvent={vi.fn()}
        />,
      );
    });

    expect(
      container.querySelector<HTMLButtonElement>(
        'button[aria-label="Adicionar Morango"]',
      )?.disabled,
    ).toBe(true);
  });
});
