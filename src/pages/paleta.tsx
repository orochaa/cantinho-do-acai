import { Banner } from '@/components/banner';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { useCart } from '@/context/cart-provider';
import { paletaCategory } from '@/domain/categories/paleta';
import { useCartEditIntent } from '@/hooks/use-cart-edit-intent';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';

export function PaletaPage(): React.JSX.Element {
  const paleta = useProduct(paletaCategory);
  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(paleta);
  const personalization = useProductPersonalization(paleta, {}, edit.item);

  return (
    <>
      <Seo
        title={`Paletas - ${paleta.name} - Cantinho do Açaí`}
        description={paleta.description}
        imgUrl={`https://cantinhodoacai.vercel.app${paleta.img}`}
      />
      <Banner
        img={paleta.img}
        name={paleta.name}
      />
      <OrderButton
        product={paleta}
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
    </>
  );
}
