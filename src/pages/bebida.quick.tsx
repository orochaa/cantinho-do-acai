import {
  QuickAddDialog,
  type QuickAddDialogProps,
} from '@/components/quick-add-dialog';

export function BebidaQuickForm(props: QuickAddDialogProps): React.JSX.Element {
  return (
    <QuickAddDialog
      {...props}
      observationPlaceholder="Exemplo: Favor enviar bem gelada"
    />
  );
}
