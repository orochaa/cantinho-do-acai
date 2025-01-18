import { Home, ShoppingCart } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { useCart } from '../context'

export function Background(): React.JSX.Element {
  const location = useLocation()

  const { cart } = useCart()

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-black to-purple-700">
      <nav className="fixed left-0 top-4 z-10 w-full">
        <div className="mx-auto flex w-11/12 max-w-4xl items-center justify-between md:px-2">
          {location.pathname === '/' ? (
            <span />
          ) : (
            <Link
              to="/"
              className="flex gap-2 rounded bg-purple-500 p-2 text-zinc-100 shadow-md"
              title="Ir para página inicial"
            >
              <Home className="size-5 shrink-0" />
              Inicio
            </Link>
          )}
          {cart.length > 0 && location.pathname !== '/cart' && (
            <Link
              to="/cart"
              className="flex gap-2 rounded bg-red-500 p-2 text-white shadow-md"
              title="Ir para página do carrinho"
            >
              <ShoppingCart className="size-5 shrink-0" />
              Carrinho
            </Link>
          )}
        </div>
      </nav>

      <Outlet />
    </div>
  )
}
