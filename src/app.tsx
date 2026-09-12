import { AppShell } from '@/components/app-shell';
import { Router } from '@/router';

export function App(): React.JSX.Element {
  return (
    <AppShell>
      <Router />
    </AppShell>
  );
}
