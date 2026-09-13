import { MenuCard } from '@/components/menu-card';
import { Seo } from '@/components/seo';
import { visibleMenu } from '@/domain/menu';
import { Navigate, useParams } from 'react-router';

export function CategoryPage(): React.JSX.Element {
  const { category: categoryRoute } = useParams();
  const entry = visibleMenu.find(item => item.route === categoryRoute);

  if (!entry) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
  }

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
              href={`/${entry.route}/${product.slang}`}
              key={product.slang}
              product={product}
            />
          ))}
        </div>
      </div>
    </>
  );
}
