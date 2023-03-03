import { Background } from '@/presentation/components'
import { ComplementsPage, HomePage } from '@/presentation/pages'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

export function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Background />}>
          <Route path="" element={<HomePage />} />
          <Route path=":item" element={<ComplementsPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
