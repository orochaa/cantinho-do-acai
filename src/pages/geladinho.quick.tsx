import {
  QuickAddDialog,
  type QuickAddDialogProps,
} from '@/components/quick-add-dialog';

export function GeladinhoQuickForm(
  props: QuickAddDialogProps,
): React.JSX.Element {
  return (
    <QuickAddDialog
      {...props}
      observationPlaceholder="Exemplo: Favor enviar bem congelado"
    />
  );
}
