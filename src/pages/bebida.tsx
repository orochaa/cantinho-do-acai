import { Banner } from '@/components/banner';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { useCart } from '@/context/cart-provider';
import { bebidaCategory } from '@/domain/categories/bebida';
import { singularOrPlural } from '@/domain/format';
import { useCartEditIntent } from '@/hooks/use-cart-edit-intent';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';

export function BebidaPage(): React.JSX.Element {
  const bebida = useProduct(bebidaCategory);

  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(bebida);

  const personalization = useProductPersonalization(bebida, {}, edit.item);

  return (
    <div>
      <Seo
        title={`Bebida - ${bebida.name} - Cantinho do Açaí`}
        description={bebida.description}
        imgUrl={`https://cantinhodoacai.vercel.app${bebida.img}`}
      />
      <Banner
        img={bebida.img}
        name={bebida.name}
        imgClassName="object-center"
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{bebida.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
              {bebida.description}
            </p>
            <span>
              {`Serve até ${singularOrPlural(bebida.people, 'pessoa', 'pessoas')}`}
            </span>
          </div>
        </div>
        <OrderButton
          product={bebida}
          initialCount={edit.item?.count}
          totalPrice={personalization.total}
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
