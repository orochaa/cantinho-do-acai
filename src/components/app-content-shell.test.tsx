import { AppContentShell } from '@/components/app-content-shell';
import { CartProvider, useCart } from '@/context/cart-provider';
import { act, useEffect } from 'react';
import type { Root } from 'react-dom/client';
import { createRoot } from 'react-dom/client';
import { MemoryRouter, useLocation } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

let activeRoot: Root | undefined;
const drawerHeightPattern = /height: ([\d.]+)px/;

// biome-ignore lint/style/useComponentExportOnlyModules: Test fixture component.
function LocationProbe(): React.JSX.Element {
  const location = useLocation();
  return <output>{location.pathname}</output>;
}

// biome-ignore lint/style/useComponentExportOnlyModules: Test fixture component.
function SeedCart(): null {
  const { cart, addCartEvent } = useCart();
  useEffect(() => {
    if (cart.length === 0) {
      addCartEvent({
        type: 'add',
        item: {
          count: 2,
          observation: '',
          options: [],
          product: {
            description: '',
            fullPrice: 10,
            img: '/img/test.png',
            name: 'Produto',
            people: 1,
            price: 10,
            slang: 'produto',
          },
        },
      });
    }
  }, [addCartEvent, cart.length]);
  return null;
}

// biome-ignore lint/style/useComponentExportOnlyModules: Test fixture component.
function AddCartButton(): React.JSX.Element {
  const { addCartEvent } = useCart();
  return (
    <button
      type="button"
      aria-label="Adicionar teste"
      onClick={() =>
        addCartEvent({
          type: 'add',
          item: {
            count: 1,
            observation: '',
            options: [],
            product: {
              description: '',
              fullPrice: 10,
              img: '/img/test.png',
              name: 'Produto',
              people: 1,
              price: 10,
              slang: 'produto',
            },
          },
        })
      }>
      Adicionar teste
    </button>
  );
}

function renderShell(
  initialPath = '/',
  populated = false,
  controls = false,
): void {
  const container = document.createElement('div');
  document.body.append(container);
  activeRoot = createRoot(container);
  act(() => {
    activeRoot?.render(
      <CartProvider>
        <MemoryRouter initialEntries={[initialPath]}>
          <AppContentShell>
            {populated ? <SeedCart /> : null}
            {controls ? <AddCartButton /> : null}
            <LocationProbe />
          </AppContentShell>
        </MemoryRouter>
      </CartProvider>,
    );
  });
}

const findButton = (label: string): HTMLButtonElement => {
  const button = Array.from(document.querySelectorAll('button')).find(
    candidate => candidate.getAttribute('aria-label') === label,
  );
  if (!(button instanceof HTMLButtonElement)) {
    throw new Error(`Button not found: ${label}`);
  }
  return button;
};

const setInputValue = (input: HTMLInputElement, value: string): void => {
  const setter = Object.getOwnPropertyDescriptor(
    HTMLInputElement.prototype,
    'value',
  )?.set;
  setter?.call(input, value);
  input.dispatchEvent(new Event('input', { bubbles: true }));
};

beforeEach(() => {
  HTMLButtonElement.prototype.setPointerCapture = vi.fn();
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
  vi.stubGlobal('requestAnimationFrame', (callback: FrameRequestCallback) => {
    callback(0);
    return 0;
  });
});

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeRoot = undefined;
  document.body.innerHTML = '';
  window.localStorage?.clear();
  vi.restoreAllMocks();
});

describe(AppContentShell.name, () => {
  it('should expose active home and cart navigation plus the search trigger', () => {
    renderShell('/cart');
    expect(
      document.querySelector('a[href="/cart"]')?.getAttribute('aria-current'),
    ).toBe('page');
    expect(
      document.querySelector('a[href="/"]')?.getAttribute('aria-label'),
    ).toBe('Início');
    expect(findButton('Buscar').getAttribute('aria-haspopup')).toBe('dialog');
    expect(findButton('Buscar').getAttribute('aria-current')).toBeNull();
  });

  it('should autofocus search and restore trigger focus after Escape', () => {
    vi.useFakeTimers();
    renderShell();
    const trigger = findButton('Buscar');
    act(() => trigger.click());
    const input =
      document.querySelector<HTMLInputElement>('#menu-search-input');
    expect(document.activeElement).toBe(input);
    const dialog = document.querySelector('dialog');
    act(() => dialog?.dispatchEvent(new Event('cancel', { cancelable: true })));
    act(() => vi.advanceTimersByTime(300));
    act(() => vi.runOnlyPendingTimers());
    expect(document.querySelector('dialog')).toBeNull();
    expect(document.activeElement).toBe(trigger);
    vi.useRealTimers();
  });

  it('should close search when clicking outside the floating panel', () => {
    vi.useFakeTimers();
    renderShell();
    act(() => findButton('Buscar').click());
    const dialog = document.querySelector('dialog');
    expect(dialog).not.toBeNull();
    act(() =>
      dialog?.querySelector<HTMLButtonElement>('.cursor-default')?.click(),
    );
    act(() => vi.advanceTimersByTime(300));
    expect(document.querySelector('dialog')).toBeNull();
    vi.useRealTimers();
  });

  it('should offer common searches that fill the search input', () => {
    renderShell();
    act(() => findButton('Buscar').click());
    const suggestion = Array.from(document.querySelectorAll('button')).find(
      button => button.textContent === 'Açaí',
    );
    expect(suggestion).not.toBeUndefined();
    act(() => suggestion?.click());
    expect(
      document.querySelector<HTMLInputElement>('#menu-search-input')?.value,
    ).toBe('Açaí');
  });

  it('should resize the fixed search panel without depending on result count', () => {
    renderShell();
    act(() => findButton('Buscar').click());
    const panel = document.querySelector('dialog section');
    expect(
      Number.parseFloat(
        panel?.getAttribute('style')?.match(drawerHeightPattern)?.[1] ?? '0',
      ),
    ).toBeCloseTo(window.innerHeight * 0.6);
    const handle = findButton('Redimensionar');
    const pointerDown = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(pointerDown, 'clientY', { value: 300 });
    const pointerUp = new Event('pointerup', { bubbles: true });
    Object.defineProperty(pointerUp, 'clientY', { value: 400 });
    act(() => {
      handle.dispatchEvent(pointerDown);
      handle.dispatchEvent(pointerUp);
    });
    expect(
      Number.parseFloat(
        panel?.getAttribute('style')?.match(drawerHeightPattern)?.[1] ?? '0',
      ),
    ).toBeCloseTo(window.innerHeight * 0.4);
    const thirdPointerDown = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(thirdPointerDown, 'clientY', { value: 400 });
    const thirdPointerUp = new Event('pointerup', { bubbles: true });
    Object.defineProperty(thirdPointerUp, 'clientY', { value: 200 });
    act(() => {
      handle.dispatchEvent(thirdPointerDown);
      handle.dispatchEvent(thirdPointerUp);
    });
    expect(
      Number.parseFloat(
        panel?.getAttribute('style')?.match(drawerHeightPattern)?.[1] ?? '0',
      ),
    ).toBeCloseTo(window.innerHeight * 0.6);
    const secondPointerDown = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(secondPointerDown, 'clientY', { value: 400 });
    const secondPointerUp = new Event('pointerup', { bubbles: true });
    Object.defineProperty(secondPointerUp, 'clientY', { value: 200 });
    act(() => {
      handle.dispatchEvent(secondPointerDown);
      handle.dispatchEvent(secondPointerUp);
    });
    expect(
      Number.parseFloat(
        panel?.getAttribute('style')?.match(drawerHeightPattern)?.[1] ?? '0',
      ),
    ).toBeCloseTo(window.innerHeight);
  });

  it('should close the drawer when swiping down below the small step', () => {
    vi.useFakeTimers();
    renderShell();
    act(() => findButton('Buscar').click());
    const handle = findButton('Redimensionar');
    const swipe = (start: number, end: number): void => {
      const down = new Event('pointerdown', { bubbles: true });
      Object.defineProperty(down, 'clientY', { value: start });
      const up = new Event('pointerup', { bubbles: true });
      Object.defineProperty(up, 'clientY', { value: end });
      act(() => {
        handle.dispatchEvent(down);
        handle.dispatchEvent(up);
      });
    };
    swipe(100, 200);
    swipe(100, 200);
    act(() => vi.advanceTimersByTime(300));
    expect(document.querySelector('dialog')).toBeNull();
    vi.useRealTimers();
  });

  it('should match categories and navigate directly to a result', () => {
    renderShell();
    act(() => findButton('Buscar').click());
    const input =
      document.querySelector<HTMLInputElement>('#menu-search-input');
    if (!input) {
      throw new Error('Search input not found');
    }
    act(() => setInputValue(input, 'pastéis'));
    expect(document.body.textContent).toContain('Pastel de Frango');
    expect(document.body.textContent).toContain('R$');
    const result = document.querySelector<HTMLAnchorElement>(
      'a[href="/pastel/pastel-de-frango"]',
    );
    expect(result).not.toBeNull();
    act(() => result?.click());
    expect(document.querySelector('output')?.textContent).toBe(
      '/pastel/pastel-de-frango',
    );
  });

  it('should show populated cart count, total, and browsing shortcut', () => {
    renderShell('/', true);
    expect(document.body.textContent).toContain('2');
    expect(document.body.textContent).toContain('R$ 20,00');
    expect(document.querySelector('a[href="/cart"]')).not.toBeNull();
  });

  it('should fade the contextual cart bar after a cart change', () => {
    vi.useFakeTimers();
    renderShell('/', true);
    const summary = document.querySelector('div.fixed.inset-x-3');
    expect(summary).not.toBeNull();
    act(() => vi.advanceTimersByTime(3000));
    expect(summary?.getAttribute('style')).toContain('opacity: 0');
    vi.useRealTimers();
  });

  it('should show the summary again after swipe close and a later cart update', () => {
    vi.useFakeTimers();
    renderShell('/', false, true);
    act(() => findButton('Adicionar teste').click());
    const summary = document.querySelector<HTMLDivElement>(
      'div.fixed.inset-x-3',
    );
    expect(summary).not.toBeNull();
    const down = new Event('pointerdown', { bubbles: true });
    Object.defineProperty(down, 'pointerId', { value: 1 });
    Object.defineProperty(down, 'clientY', { value: 100 });
    const up = new Event('pointerup', { bubbles: true });
    Object.defineProperty(up, 'pointerId', { value: 1 });
    Object.defineProperty(up, 'clientY', { value: 400 });
    act(() => {
      summary?.dispatchEvent(down);
      summary?.dispatchEvent(up);
    });
    expect(document.querySelector('div.fixed.inset-x-3')).toBeNull();
    act(() => vi.advanceTimersByTime(10_000));
    act(() => findButton('Adicionar teste').click());
    expect(document.querySelector('div.fixed.inset-x-3')).not.toBeNull();
    vi.useRealTimers();
  });

  it('should reschedule dismissal without hiding after a rapid cart update', () => {
    vi.useFakeTimers();
    renderShell('/', false, true);
    act(() => findButton('Adicionar teste').click());
    act(() => vi.advanceTimersByTime(2900));
    act(() => findButton('Adicionar teste').click());
    act(() => vi.advanceTimersByTime(200));
    expect(document.querySelector('div.fixed.inset-x-3')).not.toBeNull();
    act(() => vi.advanceTimersByTime(2800));
    expect(document.querySelector('div.fixed.inset-x-3')).not.toBeNull();
    act(() => vi.advanceTimersByTime(200));
    expect(document.querySelector('div.fixed.inset-x-3')).toBeNull();
    vi.useRealTimers();
  });

  it('should restore visibility when a cart update interrupts fading', () => {
    vi.useFakeTimers();
    renderShell('/', false, true);
    act(() => findButton('Adicionar teste').click());
    act(() => vi.advanceTimersByTime(3000));
    expect(
      document.querySelector('div.fixed.inset-x-3')?.getAttribute('style'),
    ).toContain('opacity: 0');
    act(() => findButton('Adicionar teste').click());
    expect(document.querySelector('div.fixed.inset-x-3')).not.toBeNull();
    act(() => vi.advanceTimersByTime(200));
    expect(document.querySelector('div.fixed.inset-x-3')).not.toBeNull();
    vi.useRealTimers();
  });
});
