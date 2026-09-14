import { App } from '@/app';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';

let activeRoot: Root | undefined;

afterEach(() => {
  activeRoot?.unmount();
  activeRoot = undefined;
  document.body.innerHTML = '';
  window.localStorage?.clear();
  window.history.replaceState({}, '', '/');
  vi.restoreAllMocks();
});

describe(App.name, () => {
  it('should render the home route through the production shell', async () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        disconnect(): void {}
        observe(): void {}
        unobserve(): void {}
      },
    );
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(<App />);
    });

    expect(container.textContent).toContain(
      'Escolha uma categoria para começar a montar o seu pedido.',
    );
    const categoryLink =
      container.querySelector<HTMLAnchorElement>('a[href="/acai"]');
    expect(categoryLink).not.toBeNull();

    await act(async () => {
      categoryLink?.click();
    });

    const productLink =
      container.querySelector<HTMLAnchorElement>('a[href^="/acai/"]');
    expect(productLink).not.toBeNull();

    act(() => productLink?.click());
    expect(container.textContent).toContain('Tipo de Açaí:');
  });

  it('should render an existing deep product URL directly', () => {
    vi.stubGlobal(
      'IntersectionObserver',
      class {
        disconnect(): void {}
        observe(): void {}
        unobserve(): void {}
      },
    );
    window.history.replaceState({}, '', '/pastel/pastel-de-frango');
    const container = document.createElement('div');
    document.body.append(container);
    activeRoot = createRoot(container);

    act(() => {
      activeRoot?.render(<App />);
    });

    expect(container.textContent).toContain('Pastel de Frango');
    expect(container.textContent).toContain('Tamanho:');
  });
});
