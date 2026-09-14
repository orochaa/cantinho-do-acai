import { Drawer } from '@/components/drawer';
import { act, useState } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let activeRoot: Root | undefined;

function NestedDrawers(): React.JSX.Element {
  const [childOpen, setChildOpen] = useState(false);
  const [parentOpen, setParentOpen] = useState(true);

  return (
    <Drawer
      labelledBy="parent-title"
      open={parentOpen}
      onClose={() => setParentOpen(false)}>
      <h2 id="parent-title">Drawer principal</h2>
      <button
        type="button"
        onClick={() => setChildOpen(true)}>
        Abrir drawer interno
      </button>
      <Drawer
        labelledBy="child-title"
        open={childOpen}
        onClose={() => setChildOpen(false)}>
        <h2 id="child-title">Drawer interno</h2>
      </Drawer>
    </Drawer>
  );
}

beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = true;
    },
  });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.open = false;
    },
  });
});

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeRoot = undefined;
  document.body.innerHTML = '';
  vi.restoreAllMocks();
});

describe(Drawer.name, () => {
  it('should keep the parent open when a nested drawer is cancelled', () => {
    vi.useFakeTimers();
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => activeRoot?.render(<NestedDrawers />));
    act(() =>
      Array.from(document.querySelectorAll('button'))
        .find(button => button.textContent === 'Abrir drawer interno')
        ?.click(),
    );

    expect(document.querySelectorAll('dialog')).toHaveLength(2);
    const child = Array.from(document.querySelectorAll('dialog')).find(
      dialog => dialog.getAttribute('aria-labelledby') === 'child-title',
    );
    act(() =>
      child?.dispatchEvent(
        new Event('cancel', { bubbles: true, cancelable: true }),
      ),
    );
    act(() => vi.advanceTimersByTime(180));

    expect(document.querySelectorAll('dialog')).toHaveLength(1);
    expect(document.body.textContent).toContain('Drawer principal');
    vi.useRealTimers();
  });
});
