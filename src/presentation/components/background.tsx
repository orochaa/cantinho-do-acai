import { Home, ShoppingCart } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router'
import { useCart } from '../context'

export function Background(): React.JSX.Element {
  const location = useLocation()

  const { cart } = useCart()

  return (
    <div className="relative min-h-screen bg-linear-to-br from-black to-purple-700">
      <nav className="fixed top-4 left-0 z-10 w-full">
        <div className="mx-auto flex w-11/12 max-w-3xl items-center justify-between md:px-2">
          {location.pathname === '/' ? (
            <span />
          ) : (
            <Link
              to="/"
              className="flex gap-2 rounded-sm bg-purple-500 p-2 text-zinc-100 shadow-md"
              title="Ir para página inicial"
            >
              <Home className="size-5 shrink-0" />
              Inicio
            </Link>
          )}
          {cart.length > 0 && location.pathname !== '/cart' && (
            <Link
              to="/cart"
              className="flex gap-2 rounded-sm bg-red-500 p-2 text-white shadow-md"
              title="Ir para página do carrinho"
            >
              <ShoppingCart className="size-5 shrink-0" />
              Carrinho
            </Link>
          )}
        </div>
      </nav>
      <div className="mx-auto max-w-3xl">
        <Outlet />
      </div>
    </div>
  )
}
