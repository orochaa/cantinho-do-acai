import { Banner } from '@/components/banner';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { useCart } from '@/context/cart-provider';
import { paletaCategory } from '@/domain/categories/paleta';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';

export function PaletaPage(): React.JSX.Element {
  const paleta = useProduct(paletaCategory);
  const { addCartEvent } = useCart();
  const personalization = useProductPersonalization(paleta, {});

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
        totalPrice={personalization.total}
        validate={personalization.validate}
        order={count => {
          const { total: _total, ...item } =
            personalization.createOrderItem(count);

          addCartEvent({ type: 'add', item });
        }}
      />
    </>
  );
}
