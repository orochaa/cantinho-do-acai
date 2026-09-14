import { Banner } from '@/components/banner';
import { MultipleOptionsSelector } from '@/components/multiple-options-selector';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import { salgadosCategory } from '@/domain/categories/salgados';
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

interface SalgadosPersonalizationGroups {
  complements: PersonalizationMultipleGroup;
  sauces: PersonalizationSingleGroup;
}

export function SalgadosPage(): React.JSX.Element {
  const salgado = useProduct(salgadosCategory);

  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(salgado);

  const personalization =
    useProductPersonalization<SalgadosPersonalizationGroups>(
      salgado,
      {
        complements: {
          type: 'multiple',
          options: salgado.complements.map(name => ({ name })),
          countLimit: salgado.complementsLimit,
          required: 'Favor escolher salgados',
        },
        sauces: {
          type: 'single',
          options: salgado.sauces.map(name => ({ name })),
          required: 'Favor escolher molho',
        },
      },
      edit.item,
    );

  return (
    <div>
      <Seo
        title={`Salgados - ${salgado.name} - Cantinho do Açaí`}
        description={salgado.description}
        imgUrl={`https://cantinhodoacai.vercel.app${salgado.img}`}
      />
      <Banner
        img={salgado.img}
        name={salgado.name}
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{salgado.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
              {salgado.description}
            </p>
            {!!salgado.quantity && (
              <p>Contém aproximadamente {salgado.quantity}g</p>
            )}
            <span>
              {`Serve até ${singularOrPlural(salgado.people, 'pessoa', 'pessoas')}`}
            </span>
            <span className="font-poppins text-xl font-medium">
              {formatCurrency(salgado.price)}
            </span>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <MultipleOptionsSelector
            dispatchEvent={(event: MultipleOptionsEvent) =>
              personalization.dispatch({
                type: event.type,
                group: 'complements',
                option: event.option,
              } as ProductPersonalizationEvent<SalgadosPersonalizationGroups>)
            }
            ctx={personalization.groups.complements}
            title="Salgados:"
          />
          <SingleOptionSelector
            onSelectionChange={(option: SelectableOption<string>) =>
              personalization.dispatch({
                type: 'select',
                group: 'sauces',
                option,
              } as ProductPersonalizationEvent<SalgadosPersonalizationGroups>)
            }
            ctx={personalization.groups.sauces as SingleOptionState}
            title="Molhos:"
          />
        </div>
        <OrderButton
          product={salgado}
          initialCount={edit.item?.count}
          totalPrice={personalization.total}
          multiple
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
