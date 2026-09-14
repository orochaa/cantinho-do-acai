import { MenuCard } from '@/components/menu-card';
import type { QuickAddDialogProps } from '@/components/quick-add-dialog';
import { Seo } from '@/components/seo';
import { visibleMenu } from '@/domain/menu';
import { isCartEditIntent, isQuickAddIntent } from '@/lib/navigation';
import { BebidaQuickForm } from '@/pages/bebida.quick';
import { FelicidadeQuickForm } from '@/pages/felicidade.quick';
import { GeladinhoQuickForm } from '@/pages/geladinho.quick';
import { PaletaQuickForm } from '@/pages/paleta.quick';
import { PastelQuickForm } from '@/pages/pastel.quick';
import { PremiumQuickForm } from '@/pages/premium.quick';
import { useEffect, useState } from 'react';
import { Navigate, useLocation, useNavigate, useParams } from 'react-router';

type CategoryQuickForm = (props: QuickAddDialogProps) => React.JSX.Element;

const quickForms: Readonly<Partial<Record<string, CategoryQuickForm>>> = {
  bebidas: BebidaQuickForm,
  felicidade: FelicidadeQuickForm,
  geladinho: GeladinhoQuickForm,
  paleta: PaletaQuickForm,
  pastel: PastelQuickForm,
  premium: PremiumQuickForm,
};

export function CategoryPage(): React.JSX.Element {
  const { category: categoryRoute } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const entry = visibleMenu.find(item => item.route === categoryRoute);
  const QuickForm = entry ? quickForms[entry.route] : undefined;

  useEffect(() => {
    if (!(QuickForm && entry && isQuickAddIntent(location.state))) {
      return;
    }
    const product = entry.products.find(
      candidate => candidate.slang === location.state.productSlang,
    );
    if (product) {
      setSelectedProduct(product);
    }
  }, [QuickForm, entry, location.state]);

  if (!entry) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

  const editIntent = isCartEditIntent(location.state)
    ? location.state
    : undefined;
  const editProduct = editIntent?.item.product;

  return (
    <>
      <Seo
        title={`${entry.name} - Cantinho do Açaí`}
        description={entry.category.description}
        imgUrl={`https://cantinhodoacai.vercel.app${entry.products[0]?.img ?? ''}`}
      />
      <div className="mx-auto w-11/12 pt-10 pb-24 sm:pt-14 sm:pb-28">
        <header className="mb-8 text-white">
          <h1 className="text-3xl font-bold sm:text-4xl">{entry.name}</h1>
          {!!entry.category.description && (
            <p className="mt-2 max-w-2xl text-white/80">
              {entry.category.description}
            </p>
          )}
        </header>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {entry.products.map(product => (
            <MenuCard
              href={QuickForm ? undefined : `/${entry.route}/${product.slang}`}
              key={product.slang}
              product={product}
              onClick={
                QuickForm ? () => setSelectedProduct(product) : undefined
              }
            />
          ))}
        </div>
      </div>
      {!!QuickForm && (
        <QuickForm
          open={selectedProduct !== null || !!editProduct}
          observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
          onClose={() => {
            setSelectedProduct(null);
            if (editIntent) {
              navigate('/cart');
            }
          }}
          product={selectedProduct ?? editProduct ?? null}
          editItem={editIntent?.item}
          onEditSave={() => navigate('/cart')}
        />
      )}
    </>
  );
}
