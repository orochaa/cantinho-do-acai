import { GroupedMultipleOptionsSelector } from '@/components/grouped-multiple-options-selector';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

let activeRoot: Root | undefined;

afterEach(() => {
  activeRoot?.unmount();
  activeRoot = undefined;
  document.body.innerHTML = '';
});

describe(GroupedMultipleOptionsSelector.name, () => {
  it('should render options under their group headings', () => {
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(
        <GroupedMultipleOptionsSelector
          title="Adicionais"
          ctx={{
            type: 'multiple',
            countLimit: 2,
            countTotal: 0,
            options: [
              { name: 'Creme de Morango', count: 0 },
              { name: 'Calda de Morango', count: 0 },
            ],
          }}
          groups={[
            {
              title: 'Cremes',
              options: [{ name: 'Creme de Morango', count: 0 }],
            },
            {
              title: 'Caldas',
              options: [{ name: 'Calda de Morango', count: 0 }],
            },
          ]}
          dispatchEvent={vi.fn()}
        />,
      );
    });

    expect(container.querySelectorAll('h3')).toHaveLength(2);
    expect(container.textContent).toContain('Cremes');
    expect(container.textContent).toContain('Caldas');
  });
});
