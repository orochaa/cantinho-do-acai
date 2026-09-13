import { MultipleOptionsSelector } from '@/components/multiple-options-selector';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { useCart } from '@/context/cart-provider';
import { paletaCategory } from '@/domain/categories/paleta';
import type {
  PersonalizationMultipleGroup,
  ProductPersonalizationEvent,
} from '@/domain/product-personalization';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';

interface PaletaPersonalizationGroups {
  flavors: PersonalizationMultipleGroup;
}

export function PaletaPage(): React.JSX.Element {
  const paleta = useProduct(paletaCategory);

  const { addCartEvent } = useCart();

  const personalization =
    useProductPersonalization<PaletaPersonalizationGroups>(
      { ...paleta, price: 0 },
      {
        flavors: {
          type: 'multiple',
          options: paletaCategory.flavors,
          countLimit: 20,
          required: 'Favor escolher sabores',
        },
      },
    );
  const flavors = personalization.groups.flavors;

  return (
    <>
      <Seo
        title={`Paletas - ${paleta.name} - Cantinho do Açaí`}
        description={paleta.description}
        imgUrl={`https://cantinhodoacai.vercel.app${paleta.img}`}
      />
      <div className="flex flex-col gap-8">
        <MultipleOptionsSelector
          dispatchEvent={event =>
            personalization.dispatch({
              type: event.type,
              group: 'flavors',
              option: event.option,
            } as ProductPersonalizationEvent<PaletaPersonalizationGroups>)
          }
          ctx={flavors}
          title="Sabores:"
        />
      </div>
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
