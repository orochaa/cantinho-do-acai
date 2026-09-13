import { Banner } from '@/components/banner';
import { MultipleOptionsSelector } from '@/components/multiple-options-selector';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import { acaiCategory } from '@/domain/categories/acai';
import { formatCurrency } from '@/domain/format';
import type {
  MultipleOptionsEvent,
  PersonalizationMultipleGroup,
  PersonalizationSingleGroup,
  ProductPersonalizationEvent,
} from '@/domain/product-personalization';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';
import type {
  SelectableOption,
  SingleOptionState,
} from '@/hooks/use-single-option';

interface AcaiPersonalizationGroups {
  type: PersonalizationSingleGroup;
  complements: PersonalizationMultipleGroup;
  extras: PersonalizationMultipleGroup;
}

export function AcaiPage(): React.JSX.Element {
  const acai = useProduct(acaiCategory);

  const { addCartEvent } = useCart();

  const personalization = useProductPersonalization<AcaiPersonalizationGroups>(
    acai,
    {
      type: {
        type: 'single',
        options: acai.type.map((type, i) => ({
          ...type,
          isSelected: i === 0,
        })),
      },
      complements: {
        type: 'multiple',
        options: acai.complements,
        countLimit: acai.complementsLimit,
      },
      extras: {
        type: 'multiple',
        options: acai.extras,
        countLimit: acai.extrasLimit,
      },
    },
  );

  return (
    <div>
      <Seo
        title={`Açaí ${acai.name} - Cantinho do Açaí`}
        description={acai.description}
        imgUrl={`https://cantinhodoacai.vercel.app${acai.img}`}
      />
      <Banner
        img={acai.img}
        name={acai.name}
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{acai.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
              {acai.description}
            </p>
            {!!acai.quantity && <p>Contém aproximadamente {acai.quantity}g</p>}
            <span>
              {acai.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${acai.people} pessoas`}
            </span>
            <span className="font-poppins text-xl font-medium">
              {formatCurrency(acai.price)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <SingleOptionSelector
            onSelectionChange={(option: SelectableOption<string>) =>
              personalization.dispatch({
                type: 'select',
                group: 'type',
                option,
              })
            }
            ctx={personalization.groups.type as SingleOptionState}
            title="Tipo de Açaí:"
          />
          <MultipleOptionsSelector
            dispatchEvent={(event: MultipleOptionsEvent) =>
              personalization.dispatch({
                type: event.type,
                option: event.option,
                group: 'complements',
              } as ProductPersonalizationEvent<AcaiPersonalizationGroups>)
            }
            ctx={personalization.groups.complements}
            title="Acompanhamentos:"
          />
          <MultipleOptionsSelector
            dispatchEvent={(event: MultipleOptionsEvent) =>
              personalization.dispatch({
                type: event.type,
                option: event.option,
                group: 'extras',
              } as ProductPersonalizationEvent<AcaiPersonalizationGroups>)
            }
            ctx={personalization.groups.extras}
            title="Adicionais:"
          />
        </div>
        <OrderButton
          product={acai}
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
