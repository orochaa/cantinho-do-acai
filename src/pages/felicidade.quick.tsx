import type { QuickAddDialogProps } from '@/components/quick-add-dialog';
import { QuickAddDialog } from '@/components/quick-add-dialog';

export function FelicidadeQuickForm(
  props: QuickAddDialogProps,
): React.JSX.Element {
  return <QuickAddDialog {...props} />;
}
