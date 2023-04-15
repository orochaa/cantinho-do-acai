import { Background } from '@/presentation/components'
import {
  AcaiPage,
  CartPage,
  HomePage,
  HotdogPage,
  PaletaPage,
  SalgadosPage
} from '@/presentation/pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { ScrollToTop } from './scrool-to-top'

export function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <ScrollToTop>
        <Routes>
          <Route path="" element={<Background />}>
            <Route path="" element={<HomePage />} />
            <Route path="acai/:item" element={<AcaiPage />} />
            <Route path="paleta/:item" element={<PaletaPage />} />
            <Route path="hotdog/:item" element={<HotdogPage />} />
            <Route path="salgados/:item" element={<SalgadosPage />} />
            <Route path="cart" element={<CartPage />} />
          </Route>
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  )
}
