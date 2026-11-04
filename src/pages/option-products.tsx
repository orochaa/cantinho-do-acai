import { Banner } from '@/components/banner';
import { MultipleOptionsSelector } from '@/components/multiple-options-selector';
import { OrderButton } from '@/components/order-button';
import { Seo } from '@/components/seo';
import { SingleOptionSelector } from '@/components/single-option-selector';
import { useCart } from '@/context/cart-provider';
import type { ProductOptionGroup } from '@/domain/categories/sorvete';
import { formatCurrency } from '@/domain/format';
import { createOrderItem, createProductPriceDiscount } from '@/domain/order';
import type {
  MultipleOptionsEvent,
  MultipleOptionsState,
  PersonalizationGroup,
} from '@/domain/product-personalization';
import { useCartEditIntent } from '@/hooks/use-cart-edit-intent';
import { useProduct } from '@/hooks/use-product';
import { useProductPersonalization } from '@/hooks/use-product-personalization';

interface OptionProductsPageProps {
  category: Category<Product & { optionGroups: Array<ProductOptionGroup> }>;
  categoryTitle: string;
}

export function OptionProductsPage(
  props: OptionProductsPageProps,
): React.JSX.Element {
  const product = useProduct(props.category);
  const { addCartEvent } = useCart();
  const edit = useCartEditIntent(product);
  const groups = Object.fromEntries(
    product.optionGroups.map((group, index) => {
      const options = group.options.map(option => ({
        name: option.name,
        ...(option.img ? { img: option.img } : {}),
        ...(option.price === undefined ? {} : { price: option.price }),
      }));
      const required = group.required;

      return [
        `group${index}`,
        group.selection === 'single'
          ? {
              type: 'single',
              options: options.map(option => ({
                ...option,
                isSelected: false,
              })),
              required,
            }
          : {
              type: 'multiple',
              options,
              required,
            },
      ];
    }),
  ) as Record<string, PersonalizationGroup>;
  const personalization = useProductPersonalization(product, groups, edit.item);
  const shouldDiscountProductPrice = product.optionGroups.some(
    (group, index) => {
      const groupState = personalization.groups[`group${index}`];
      return (
        group.discountProductPrice &&
        groupState?.options.some(option => option.count > 0)
      );
    },
  );
  const totalPrice =
    personalization.total - (shouldDiscountProductPrice ? product.price : 0);

  return (
    <div>
      <Seo
        title={`${props.categoryTitle} - ${product.name} - Cantinho do Açaí`}
        description={product.description}
        imgUrl={`https://cantinhodoacai.vercel.app${product.img}`}
      />
      <Banner product={product} />
      <div className="mx-auto w-4xl max-w-11/12 pb-8 sm:pb-12 lg:pb-16">
        <div className="py-6 text-white">
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="mt-2 font-poppins text-xl font-medium">
            {formatCurrency(product.price)}
          </p>
        </div>
        <div className="flex flex-col gap-8">
          {product.optionGroups.map((group, index) => {
            const groupState = personalization.groups[`group${index}`];
            if (groupState?.type === 'single') {
              return (
                <SingleOptionSelector
                  key={group.title}
                  title={group.title}
                  ctx={groupState}
                  required={!!group.required}
                  onSelectionChange={option =>
                    personalization.dispatch({
                      type: 'select',
                      group: `group${index}`,
                      option,
                    } as never)
                  }
                />
              );
            }

            return (
              <MultipleOptionsSelector
                key={group.title}
                title={group.title}
                ctx={groupState as MultipleOptionsState}
                dispatchEvent={(event: MultipleOptionsEvent) =>
                  personalization.dispatch({
                    type: event.type,
                    group: `group${index}`,
                    option: event.option,
                  })
                }
              />
            );
          })}
        </div>
        <OrderButton
          product={product}
          initialCount={edit.item?.count}
          totalPrice={totalPrice}
          multiple
          validate={personalization.validate}
          order={count => {
            const draft = personalization.createOrderItem(count);
            const orderItem = createOrderItem({
              ...draft,
              options: shouldDiscountProductPrice
                ? [...draft.options, createProductPriceDiscount(product)]
                : draft.options,
            });
            const { total: _total, ...item } = orderItem;

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
