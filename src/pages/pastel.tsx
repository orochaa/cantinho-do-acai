import { Banner } from '@/components/banner';
import { Description } from '@/components/description';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';
import type {
  SelectableOption,
  SingleOptionState,
} from '@/hooks/use-single-option';
import { pastelCategory } from '@/lib/data/pastel';
import type { PersonalizationSingleGroup } from '@/lib/product-personalization';

interface PastelPersonalizationGroups {
  size: PersonalizationSingleGroup;
}

export function PastelPage(): React.JSX.Element {
  const pastel = useProduct(pastelCategory);

  const { addCartEvent } = useCart();

  const personalization =
    useProductPersonalization<PastelPersonalizationGroups>(
      { ...pastel, price: 0 },
      {
        size: {
          type: 'single',
          options: pastelCategory.size.map((item, i) => ({
            ...item,
            price: pastel.price + item.price,
            isSelected: i === 1,
          })),
        },
      },
    );

  return (
    <div>
      <Seo
        title={`Copo da Pastel ${pastel.name} - Cantinho do Açaí`}
        description={pastel.description}
        imgUrl={`https://cantinhodoacai.vercel.app${pastel.img}`}
      />
      <Banner
        img={pastel.img}
        name={pastel.name}
        imgClassName="object-top"
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{pastel.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <Description>{pastel.description}</Description>
            {!!pastel.quantity && (
              <p>Contém aproximadamente {pastel.quantity}g</p>
            )}
            <span>
              {pastel.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${pastel.people} pessoas`}
            </span>
          </div>
        </div>

        <SingleOptionSelector
          onSelectionChange={(option: SelectableOption<string>) =>
            personalization.dispatch({
              type: 'select',
              group: 'size',
              option,
            })
          }
          ctx={personalization.groups.size as SingleOptionState}
          title="Tamanho:"
        />
        <OrderButton
          product={pastel}
          totalPrice={personalization.total}
          validate={personalization.validate}
          multiple
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
