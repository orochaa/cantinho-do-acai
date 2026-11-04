import {
  QuickAddDialog,
  type QuickAddDialogProps,
  type QuickAddOptionStep,
} from '@/components/quick-add-dialog';
import { picoleCategory } from '@/domain/categories/picole';
import { useProduct } from '@/hooks/use-product';

export function PicoleQuickForm(props: QuickAddDialogProps): React.JSX.Element {
  const product = useProduct(picoleCategory, props.product?.slang);
  const steps: ReadonlyArray<QuickAddOptionStep> = product.optionGroups.map(
    (group, index) => ({
      id: `option-group-${index}`,
      title: group.title,
      description: group.description,
      discountProductPrice: group.discountProductPrice,
      required: group.required,
      selection: 'multiple',
      options: group.options.map(option => ({
        name: option.name,
        price: option.price ?? 0,
        img: option.img,
      })),
    }),
  );

  return (
    <QuickAddDialog
      {...props}
      observationPlaceholder="Exemplo: Favor enviar bem congelado"
      steps={steps}
    />
  );
}
