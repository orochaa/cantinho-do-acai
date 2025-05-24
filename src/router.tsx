import { Background } from '@/components/background'
import { CartProvider } from '@/context/cart-provider'
import { AcaiPage } from '@/pages/acai'
import { CartPage } from '@/pages/cart'
import { FelicidadePage } from '@/pages/felicidade'
import { GeladinhoPage } from '@/pages/geladinho'
import { HomePage } from '@/pages/home'
import { PaletaPage } from '@/pages/paleta'
import { PremiumPage } from '@/pages/premium'
import { SalgadosPage } from '@/pages/salgados'
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
