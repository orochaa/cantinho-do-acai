import { categories, objectEntries, slang } from '@/presentation/data'
import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context'

export function HomePage(): JSX.Element {
  const { cart } = useCart()
  return (
    <>
      {cart.length && (
        <Link
          to="/cart"
          className="absolute -top-8 right-4 rounded border border-red-300 bg-red-500/90 p-2 text-white/90 "
        >
          <ShoppingCart size={20} />
        </Link>
      )}
      <img
        src="/img/logo.png"
        alt="logo cantinho do açaí"
        className="mx-auto mb-8 max-h-48 w-11/12 max-w-fit"
      />
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
        {objectEntries(categories).map(([name, { to, products }], i) => (
          <div key={i}>
            <h1 className="mb-4 border-b-2 border-amber-600 p-1 font-raleway text-2xl text-white/90">
              {name}
            </h1>
            <div className="gap grid grid-cols-1 gap-4 md:grid-cols-2">
              {products.map(product => (
                <Link
                  key={slang(product.name)}
                  to={slang(to + '/' + product.name)}
                  className="rounded-xl border-2 border-violet-500/90 p-2 transition hover:-translate-y-1 hover:border-amber-400"
                >
                  <div className="relative flex max-h-[350px] items-end justify-center overflow-hidden rounded-xl">
                    <img
                      src={product.img}
                      alt={`Imagem ${product.name}`}
                      className="object-cover h-full w-full"
                    />
                    <div className="absolute inset-0 z-10 bg-black/30" />
                    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between bg-zinc-50/80 p-6">
                      <div>
                        <h2 className="text-xl font-bold text-black">
                          {product.name}
                        </h2>
                        <p className="text md:text-base">
                          Serve até {product.people} pessoa
                          {product.people !== 1 && 's'}. (aprox.
                          {product.quantity}
                          g)
                        </p>
                      </div>
                      <span className="block whitespace-nowrap font-poppins text-xl font-semibold tracking-tighter">
                        R$ {product.price},00
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
