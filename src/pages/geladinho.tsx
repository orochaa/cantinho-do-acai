import { Banner } from '@/components/banner';
import { MultipleOptionsSelector } from '@/components/multiple-options-selector';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { useCart } from '@/context/cart-provider';
import type {
  MultipleOptionsEvent,
  MultipleOptionsState,
} from '@/hooks/use-multiple-options';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';
import { geladinhoCategory } from '@/lib/data/geladinho';
import type {
  PersonalizationMultipleGroup,
  ProductPersonalizationEvent,
} from '@/lib/product-personalization';

interface GeladinhoPersonalizationGroups {
  flavors: PersonalizationMultipleGroup;
}

export function GeladinhoPage(): React.JSX.Element {
  const geladinho = useProduct(geladinhoCategory);

  const { addCartEvent } = useCart();

  const orderProduct = { ...geladinho, price: 0 };
  const personalization =
    useProductPersonalization<GeladinhoPersonalizationGroups>(orderProduct, {
      flavors: {
        type: 'multiple',
        options: geladinhoCategory.flavors,
        countLimit: 20,
        required: 'Favor escolher sabores',
      },
    });

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
            <p className="text-pretty whitespace-pre-line">
              {geladinho.description}
            </p>
            {!!geladinho.quantity && (
              <p>Contém aproximadamente {geladinho.quantity}g</p>
            )}
            <span>
              {geladinho.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${geladinho.people} pessoas`}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <MultipleOptionsSelector
            dispatchEvent={(event: MultipleOptionsEvent) =>
              personalization.dispatch({
                type: event.type === 'ADD' ? 'add' : 'remove',
                group: 'flavors',
                option: event.option,
              } as ProductPersonalizationEvent<GeladinhoPersonalizationGroups>)
            }
            ctx={personalization.groups.flavors as MultipleOptionsState}
            title="Sabores:"
          />
        </div>
        <OrderButton
          product={geladinho}
          totalPrice={personalization.total}
          validate={personalization.validate}
          order={count => {
            const { total: _total, ...item } =
              personalization.createOrderItem(count);

            addCartEvent({ type: 'add', item });
          }}
        />
      </div>
      <span className="block h-20" />
    </div>
  );
}
