import { Banner } from '@/components/banner';
import { Container } from '@/components/container';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { Textarea } from '@/components/textarea';
import { useCart } from '@/context/cart-provider';
import { premiumCategory } from '@/domain/categories/premium';
import { formatCurrency } from '@/domain/format';
import type {
  PersonalizationSingleGroup,
  SelectableOption,
  SingleOptionState,
} from '@/domain/product-personalization';
import { useCartEditIntent } from '@/hooks/use-cart-edit-intent';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';
import { useEffect, useState } from 'react';

interface PremiumPersonalizationGroups {
  complements: PersonalizationSingleGroup;
}

export function PremiumPage(): React.JSX.Element {
  const copo = useProduct(premiumCategory);

  const [observation, setObservation] = useState<string>('');

  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(copo);

  const personalization =
    useProductPersonalization<PremiumPersonalizationGroups>(
      copo,
      {
        complements: {
          type: 'single',
          options: (copo.complements ?? []).map(name => ({ name })),
          required:
            copo.complements !== undefined && copo.complements.length > 0
              ? 'Escolha seu Fini'
              : undefined,
        },
      },
      edit.item,
    );

  useEffect(() => setObservation(edit.item?.observation ?? ''), [edit.item]);

  return (
    <div>
      <Seo
        title={`Açaí Premium ${copo.name} - Cantinho do Açaí`}
        description={copo.description}
        imgUrl={`https://cantinhodoacai.vercel.app${copo.img}`}
      />
      <Banner
        img={copo.img}
        name={copo.name}
        imgClassName="object-top"
      />
      <div className="mx-auto w-11/12">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{copo.name}</h2>
          <div className="mt-2 flex flex-col gap-1 text-base">
            <p className="text-pretty whitespace-pre-line">
              {copo.description}
            </p>
            {!!copo.quantity && <p>Contém aproximadamente {copo.quantity}g</p>}
            <span>
              {copo.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${copo.people} pessoas`}
            </span>
            <span className="font-poppins text-xl font-medium">
              {formatCurrency(copo.price)}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {!!copo.complements && (
            <SingleOptionSelector
              title="Fini"
              ctx={personalization.groups.complements as SingleOptionState}
              onSelectionChange={(option: SelectableOption<string>) =>
                personalization.dispatch({
                  type: 'select',
                  group: 'complements',
                  option,
                })
              }
            />
          )}

          <Container>
            <label
              htmlFor="observation"
              className="m-1 text-xl font-bold text-white">
              Observação
            </label>
            <Textarea
              id="observation"
              rows={4}
              value={observation}
              onChange={e => setObservation(e.target.value)}
              placeholder="Exemplo: Favor retirar..."
            />
          </Container>
        </div>

        <OrderButton
          product={copo}
          initialCount={edit.item?.count}
          totalPrice={personalization.total}
          multiple
          validate={personalization.validate}
          order={count => {
            const { total: _total, ...item } = personalization.createOrderItem(
              count,
              observation,
            );

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
