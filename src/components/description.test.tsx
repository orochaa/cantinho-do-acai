import { Description } from '@/components/description';
import { act, type SyntheticEvent } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

let activeRoot: Root | undefined;
const clientHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLParagraphElement.prototype,
  'clientHeight',
);
const scrollHeightDescriptor = Object.getOwnPropertyDescriptor(
  HTMLParagraphElement.prototype,
  'scrollHeight',
);

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeRoot = undefined;
  document.body.innerHTML = '';
  if (clientHeightDescriptor) {
    Object.defineProperty(
      HTMLParagraphElement.prototype,
      'clientHeight',
      clientHeightDescriptor,
    );
  }
  if (scrollHeightDescriptor) {
    Object.defineProperty(
      HTMLParagraphElement.prototype,
      'scrollHeight',
      scrollHeightDescriptor,
    );
  }
  vi.restoreAllMocks();
});

describe(Description.name, () => {
  it('should expand and collapse the description from its Portuguese control', () => {
    Object.defineProperty(HTMLParagraphElement.prototype, 'clientHeight', {
      configurable: true,
      value: 20,
    });
    Object.defineProperty(HTMLParagraphElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 100,
    });
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() =>
      activeRoot?.render(
        <Description>
          Uma descrição longa para apresentar os detalhes do produto.
        </Description>,
      ),
    );

    const button = container.querySelector('button');
    const paragraph = container.querySelector('p');

    expect(button?.textContent).toBe('mostrar mais');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
    expect(paragraph?.className).toContain('line-clamp-5');

    act(() => button?.click());

    expect(button?.textContent).toBe('mostrar menos');
    expect(button?.getAttribute('aria-expanded')).toBe('true');
    expect(paragraph?.className).toContain('line-clamp-none');

    act(() => button?.click());

    expect(button?.textContent).toBe('mostrar mais');
    expect(button?.getAttribute('aria-expanded')).toBe('false');
  });

  it('should hide the control when the description does not overflow', () => {
    Object.defineProperty(HTMLParagraphElement.prototype, 'clientHeight', {
      configurable: true,
      value: 20,
    });
    Object.defineProperty(HTMLParagraphElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 20,
    });
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => activeRoot?.render(<Description>Descrição curta.</Description>));

    expect(container.querySelector('button')).toBeNull();
  });

  it('should not submit a surrounding form when toggled', () => {
    Object.defineProperty(HTMLParagraphElement.prototype, 'clientHeight', {
      configurable: true,
      value: 20,
    });
    Object.defineProperty(HTMLParagraphElement.prototype, 'scrollHeight', {
      configurable: true,
      value: 100,
    });
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);
    const onSubmit = vi.fn((event: SyntheticEvent<HTMLFormElement>) =>
      event.preventDefault(),
    );

    act(() =>
      activeRoot?.render(
        <form onSubmit={onSubmit}>
          <Description>Descrição do produto.</Description>
        </form>,
      ),
    );

    act(() => container.querySelector('button')?.click());

    expect(onSubmit).not.toHaveBeenCalled();
    expect(container.querySelector('button')?.type).toBe('button');
  });
});
