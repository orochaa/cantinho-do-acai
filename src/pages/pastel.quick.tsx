import type { QuickAddDialogProps } from '@/components/quick-add-dialog';
import { QuickAddDialog } from '@/components/quick-add-dialog';
import { pastelCategory } from '@/domain/categories/pastel';

const pastelQuickSteps = [
  {
    defaultOptionIndex: 1,
    id: 'size',
    title: 'Qual tamanho você prefere?',
    description: 'Escolha o tamanho do seu pastel.',
    options: pastelCategory.size,
  },
] as const;

export function PastelQuickForm(props: QuickAddDialogProps): React.JSX.Element {
  return (
    <QuickAddDialog
      {...props}
      steps={pastelQuickSteps}
    />
  );
}
