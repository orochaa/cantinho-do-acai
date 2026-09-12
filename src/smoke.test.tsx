import { formatCurrency } from '@/lib/format';
import { act } from 'react';
import { createRoot } from 'react-dom/client';

describe('Vitest setup', () => {
  it('should support React JSX, the DOM environment, and path aliases', () => {
    const element = <span>{formatCurrency(12.5)}</span>;
    const container = document.createElement('div');
    const root = createRoot(container);

    document.body.append(container);
    act(() => root.render(element));

    expect(container.textContent).toBe('R$\u00a012,50');
    expect(element.type).toBe('span');

    root.unmount();
    container.remove();
  });
});
