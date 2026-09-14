import type { QuickAddDialogProps } from '@/components/quick-add-dialog';
import { QuickAddDialog } from '@/components/quick-add-dialog';

export function PaletaQuickForm(props: QuickAddDialogProps): React.JSX.Element {
  return (
    <QuickAddDialog
      {...props}
      observationPlaceholder="Exemplo: Favor enviar bem congelada"
    />
  );
}
