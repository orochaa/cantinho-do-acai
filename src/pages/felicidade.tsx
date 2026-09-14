import { Banner } from '@/components/banner';
import { Description } from '@/components/description';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { useCart } from '@/context/cart-provider';
import { felicidadeCategory } from '@/domain/categories/felicidade';
import { formatCurrency, singularOrPlural } from '@/domain/format';
import { useCartEditIntent } from '@/hooks/use-cart-edit-intent';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';

type FelicidadePersonalizationGroups = Record<never, never>;

export function FelicidadePage(): React.JSX.Element {
  const copo = useProduct(felicidadeCategory);

  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(copo);

  const personalization =
    useProductPersonalization<FelicidadePersonalizationGroups>(
      copo,
      {},
      edit.item,
    );

  return (
    <div>
      <Seo
        title={`Copo da Felicidade ${copo.name} - Cantinho do Açaí`}
        description={copo.description}
        imgUrl={`https://cantinhodoacai.vercel.app${copo.img}`}
      />
      <Banner
        img={copo.img}
        name={copo.name}
        imgClassName="object-top"
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{copo.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <Description>{copo.description}</Description>
            {!!copo.quantity && <p>Contém aproximadamente {copo.quantity}g</p>}
            <span>
              {`Serve até ${singularOrPlural(copo.people, 'pessoa', 'pessoas')}`}
            </span>
            <span className="font-poppins text-xl font-medium">
              {formatCurrency(copo.price)}
            </span>
          </div>
        </div>

        <OrderButton
          product={copo}
          initialCount={edit.item?.count}
          totalPrice={personalization.total}
          multiple
          validate={personalization.validate}
          order={count => {
            const { total: _total, ...item } =
              personalization.createOrderItem(count);

            if (edit.item) {
              edit.save(item);
            } else {
              addCartEvent({ type: 'add', item });
            }
          }}
        />
      </div>
      <span className="block h-20" />
    </div>
  );
}
