import { AppContentShell } from '@/components/app-content-shell';
import { visibleMenu } from '@/domain/menu';
import { useDailyAppPing } from '@/hooks/use-daily-app-ping';
import { AcaiPage } from '@/pages/acai';
import { BebidaPage } from '@/pages/bebida';
import { CartPage } from '@/pages/cart/cart';
import { FelicidadePage } from '@/pages/felicidade';
import { GeladinhoPage } from '@/pages/geladinho';
import { HomePage } from '@/pages/home';
import { PaletaPage } from '@/pages/paleta';
import { PastelPage } from '@/pages/pastel';
import { PremiumPage } from '@/pages/premium';
import { SalgadosPage } from '@/pages/salgados';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ScrollToTop } from './scrool-to-top';

const categoryPages: Record<string, React.JSX.Element> = {
  acai: <AcaiPage />,
  paleta: <PaletaPage />,
  salgados: <SalgadosPage />,
  felicidade: <FelicidadePage />,
  premium: <PremiumPage />,
  geladinho: <GeladinhoPage />,
  bebidas: <BebidaPage />,
  pastel: <PastelPage />,
};

export function Router(): React.JSX.Element {
  useDailyAppPing();

  return (
    <BrowserRouter>
      <AppContentShell>
        <ScrollToTop>
          <Routes>
            <Route
              path=""
              element={<HomePage />}
            />
            {visibleMenu.map(entry => (
              <Route
                key={entry.route}
                path={entry.path}
                element={categoryPages[entry.route]}
              />
            ))}
            <Route
              path="cart"
              element={<CartPage />}
            />
          </Routes>
        </ScrollToTop>
      </AppContentShell>
    </BrowserRouter>
  );
}
