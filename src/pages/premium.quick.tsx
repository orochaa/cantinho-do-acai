import {
  QuickAddDialog,
  type QuickAddDialogProps,
} from '@/components/quick-add-dialog';

export function PremiumQuickForm(
  props: QuickAddDialogProps,
): React.JSX.Element {
  return (
    <QuickAddDialog
      {...props}
      observationPlaceholder="Exemplo: Favor retirar algum ingrediente"
    />
  );
}
