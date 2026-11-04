import { premiumCategory } from '@/domain/categories/premium';
import { sorveteCategory } from '@/domain/categories/sorvete';
import { useProduct } from '@/hooks/use-product';
import { act } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { MemoryRouter, Route, Routes } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';

interface ProductProbeProps {
  productSlang?: string;
}

function SorveteProductProbe(props: ProductProbeProps): React.JSX.Element {
  const product = useProduct(sorveteCategory, props.productSlang);
  return <output>{product.name}</output>;
}

function PremiumProductProbe(): React.JSX.Element {
  const product = useProduct(premiumCategory);
  return <output>{product.name}</output>;
}

let activeRoot: Root | undefined;

const renderRoute = (
  path: string,
  route: React.JSX.Element,
): HTMLDivElement => {
  const container = document.createElement('div');
  document.body.append(container);
  activeRoot = createRoot(container);

  act(() => {
    activeRoot?.render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>{route}</Routes>
      </MemoryRouter>,
    );
  });

  return container;
};

afterEach(() => {
  act(() => activeRoot?.unmount());
  activeRoot = undefined;
  document.body.innerHTML = '';
});

describe(useProduct.name, () => {
  it('should prefer an explicit product slug over the route slug', () => {
    const container = renderRoute(
      '/sorvetes/pote-de-sorvete-1-litro',
      <Route
        path="/sorvetes/:slang"
        element={
          <SorveteProductProbe productSlang="pote-de-sorvete-2-litros" />
        }
      />,
    );

    expect(container.textContent).toBe('Pote de Sorvete 2 Litros');
  });

  it('should resolve the product slug from the route when no override is given', () => {
    const container = renderRoute(
      '/sorvetes/pote-de-sorvete-2-litros',
      <Route
        path="/sorvetes/:slang"
        element={<SorveteProductProbe />}
      />,
    );

    expect(container.textContent).toBe('Pote de Sorvete 2 Litros');
  });

  it('should return the first product when the route slug is unknown', () => {
    const container = renderRoute(
      '/sorvetes/unknown-product',
      <Route
        path="/sorvetes/:slang"
        element={<SorveteProductProbe />}
      />,
    );

    expect(container.textContent).toBe('Pote de Sorvete 1 Litro');
  });

  it('should skip disabled products when resolving a route slug', () => {
    const container = renderRoute(
      '/premium/fini-fest',
      <Route
        path="/premium/:slang"
        element={<PremiumProductProbe />}
      />,
    );

    expect(container.textContent).toBe('Tentação');
  });
});
