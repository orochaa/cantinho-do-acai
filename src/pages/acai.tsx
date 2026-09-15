import { Banner } from '@/components/banner';
import { Description } from '@/components/description';
import {
  GroupedMultipleOptionsSelector,
  type MultipleOptionsGroup,
} from '@/components/grouped-multiple-options-selector';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import { acaiCategory } from '@/domain/categories/acai';
import { groupAcaiComplements } from '@/domain/categories/acai-complement-groups';
import type { AcaiComplement } from '@/domain/categories/acai-complements';
import type { AcaiExtra } from '@/domain/categories/acai-extra';
import { groupAcaiExtras } from '@/domain/categories/acai-extra-groups';
import { formatCurrency, singularOrPlural } from '@/domain/format';
import type {
  MultipleOptionsEvent,
  PersonalizationMultipleGroup,
  PersonalizationSingleGroup,
  ProductPersonalizationEvent,
  SelectableOption,
  SingleOptionState,
} from '@/domain/product-personalization';
import { useCartEditIntent } from '@/hooks/use-cart-edit-intent';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';
import { useMemo } from 'react';

interface AcaiPersonalizationGroups {
  type: PersonalizationSingleGroup;
  complements: PersonalizationMultipleGroup<AcaiComplement>;
  extras: PersonalizationMultipleGroup<AcaiExtra>;
}

export function AcaiPage(): React.JSX.Element {
  const acai = useProduct(acaiCategory);

  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(acai);

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
    edit.item,
  );

  const extraGroups = useMemo<Array<MultipleOptionsGroup<AcaiExtra>>>(
    () => groupAcaiExtras(personalization.groups.extras.options),
    [personalization.groups.extras.options],
  );
  const complementGroups = useMemo<Array<MultipleOptionsGroup<AcaiComplement>>>(
    () => groupAcaiComplements(personalization.groups.complements.options),
    [personalization.groups.complements.options],
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
      <div className="mx-auto w-3xl max-w-11/12 pb-8 sm:pb-12 lg:pb-16">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{acai.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <Description>{acai.description}</Description>
            {!!acai.quantity && <p>Contém aproximadamente {acai.quantity}g</p>}
            <span>
              {`Serve até ${singularOrPlural(acai.people, 'pessoa', 'pessoas')}`}
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
          <GroupedMultipleOptionsSelector
            dispatchEvent={(event: MultipleOptionsEvent) =>
              personalization.dispatch({
                type: event.type,
                option: event.option,
                group: 'complements',
              } as ProductPersonalizationEvent<AcaiPersonalizationGroups>)
            }
            ctx={personalization.groups.complements}
            groups={complementGroups}
            title="Acompanhamentos:"
          />
          <GroupedMultipleOptionsSelector
            dispatchEvent={(event: MultipleOptionsEvent) =>
              personalization.dispatch({
                type: event.type,
                option: event.option,
                group: 'extras',
              } as ProductPersonalizationEvent<AcaiPersonalizationGroups>)
            }
            ctx={personalization.groups.extras}
            groups={extraGroups}
            title="Adicionais:"
          />
        </div>
        <OrderButton
          product={acai}
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
    </div>
  );
}
