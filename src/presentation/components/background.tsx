import { Home, ShoppingCart } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../context'

export function Background(): React.JSX.Element {
  const location = useLocation()

  const { cart } = useCart()

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-700">
      <div className="relative mx-auto w-11/12 max-w-4xl">
        <header className="fixed top-4 z-10 flex w-full max-w-4xl items-center">
          {location.pathname !== '/' && (
            <Link
              to="/"
              className="flex gap-2 rounded bg-purple-500 p-2 text-zinc-100 shadow-md md:right-96"
              title="Ir para página inicial"
            >
              <Home className="size-5" />
              Inicio
            </Link>
          )}
          {cart.length > 0 && location.pathname !== '/cart' && (
            <Link
              to="/cart"
              className="ml-auto flex gap-2 rounded bg-red-500 p-2 text-white shadow-md"
              title="Ir para página do carrinho"
            >
              <ShoppingCart className="size-5" />
              Carrinho
            </Link>
          )}
        </header>
        <main className="relative py-20">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
