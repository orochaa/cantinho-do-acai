import { HomePage } from '@/presentation/pages'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

export function Router(): JSX.Element {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="" element={<HomePage />} />
      </Routes>
    </BrowserRouter>
  )
}
