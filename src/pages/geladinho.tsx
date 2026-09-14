import { Banner } from '@/components/banner';
import { Description } from '@/components/description';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { useCart } from '@/context/cart-provider';
import { geladinhoCategory } from '@/domain/categories/geladinho';
import { singularOrPlural } from '@/domain/format';
import { useCartEditIntent } from '@/hooks/use-cart-edit-intent';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';

export function GeladinhoPage(): React.JSX.Element {
  const geladinho = useProduct(geladinhoCategory);

  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(geladinho);

  const orderProduct = { ...geladinho, price: 0 };
  const personalization = useProductPersonalization(
    orderProduct,
    {},
    edit.item,
  );

  return (
    <div>
      <Seo
        title={`Geladinho - ${geladinho.name} - Cantinho do Açaí`}
        description={geladinho.description}
        imgUrl={`https://cantinhodoacai.vercel.app${geladinho.img}`}
      />
      <Banner
        img={geladinho.img}
        name={geladinho.name}
        imgClassName="object-top"
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{geladinho.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <Description>{geladinho.description}</Description>
            {!!geladinho.quantity && (
              <p>Contém aproximadamente {geladinho.quantity}g</p>
            )}
            <span>
              {`Serve até ${singularOrPlural(geladinho.people, 'pessoa', 'pessoas')}`}
            </span>
          </div>
        </div>

        <OrderButton
          product={geladinho}
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
