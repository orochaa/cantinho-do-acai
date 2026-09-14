import { Banner } from '@/components/banner';
import { Description } from '@/components/description';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import { pastelCategory } from '@/domain/categories/pastel';
import { singularOrPlural } from '@/domain/format';
import type {
  PersonalizationSingleGroup,
  SelectableOption,
  SingleOptionState,
} from '@/domain/product-personalization';
import { useCartEditIntent } from '@/hooks/use-cart-edit-intent';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';

interface PastelPersonalizationGroups {
  size: PersonalizationSingleGroup;
}

export function PastelPage(): React.JSX.Element {
  const pastel = useProduct(pastelCategory);

  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(pastel);

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
      edit.item,
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
              {`Serve até ${singularOrPlural(pastel.people, 'pessoa', 'pessoas')}`}
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
          initialCount={edit.item?.count}
          totalPrice={personalization.total}
          validate={personalization.validate}
          multiple
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
