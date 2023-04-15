import { Background } from '@/presentation/components'
import { AcaiPage, CartPage, HomePage, PaletaPage } from '@/presentation/pages'
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
            <Route path="cart" element={<CartPage />} />
          </Route>
        </Routes>
      </ScrollToTop>
    </BrowserRouter>
  )
}
