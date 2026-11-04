import {
  QuickAddDialog,
  type QuickAddDialogProps,
  type QuickAddOptionStep,
} from '@/components/quick-add-dialog';
import { sorveteCategory } from '@/domain/categories/sorvete';
import { useProduct } from '@/hooks/use-product';

export function SorveteQuickForm(
  props: QuickAddDialogProps,
): React.JSX.Element {
  const product = useProduct(sorveteCategory, props.product?.slang);
  const steps: ReadonlyArray<QuickAddOptionStep> = product.optionGroups.map(
    (group, index) => ({
      id: `option-group-${index}`,
      title: group.title,
      description: group.description,
      discountProductPrice: group.discountProductPrice,
      required: group.required,
      selection: group.selection ?? 'multiple',
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
