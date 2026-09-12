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
import { bebidaCategory } from '@/lib/data/bebida';
import type {
  PersonalizationMultipleGroup,
  ProductPersonalizationEvent,
} from '@/lib/product-personalization';

interface BebidaPersonalizationGroups {
  flavors: PersonalizationMultipleGroup;
}

export function BebidaPage(): React.JSX.Element {
  const bebida = useProduct(bebidaCategory);

  const { addCartEvent } = useCart();

  const personalization =
    useProductPersonalization<BebidaPersonalizationGroups>(
      { ...bebida, price: 0 },
      {
        flavors: {
          type: 'multiple',
          options: bebidaCategory.flavors,
          countLimit: 20,
          required: 'Favor escolher sabores',
        },
      },
    );

  const dispatchFlavorEvent = (event: MultipleOptionsEvent): void => {
    personalization.dispatch({
      type: event.type === 'ADD' ? 'add' : 'remove',
      group: 'flavors',
      option: event.option,
    } as ProductPersonalizationEvent<BebidaPersonalizationGroups>);
  };

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
              {bebida.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${bebida.people} pessoas`}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <MultipleOptionsSelector
            dispatchEvent={dispatchFlavorEvent}
            ctx={personalization.groups.flavors as MultipleOptionsState}
            title="Sabores:"
          />
        </div>
        <OrderButton
          product={bebida}
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
