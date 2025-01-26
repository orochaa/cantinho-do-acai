import { Background } from '@/presentation/components'
import { CartProvider } from '@/presentation/context'
import {
  AcaiPage,
  CartPage,
  FelicidadePage,
  GeladinhoPage,
  HomePage,
  PaletaPage,
  PremiumPage,
  SalgadosPage,
} from '@/presentation/pages'
import { BrowserRouter, Route, Routes } from 'react-router'
import { ScrollToTop } from './scrool-to-top'

export function Router(): React.JSX.Element {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route
            path=""
            element={
              <CartProvider>
                <Background />
              </CartProvider>
            }
          >
            <Route path="" element={<HomePage />} />
            <Route path="acai/:slang" element={<AcaiPage />} />
            <Route path="paleta/:slang" element={<PaletaPage />} />
            <Route path="salgados/:slang" element={<SalgadosPage />} />
            <Route path="felicidade/:slang" element={<FelicidadePage />} />
            <Route path="premium/:slang" element={<PremiumPage />} />
            <Route path="geladinho/:slang" element={<GeladinhoPage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  )
}
