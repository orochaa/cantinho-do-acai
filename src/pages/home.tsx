import { Seo } from '@/components/seo'
import { categories } from '@/lib/data/categories'
import { formatCurrency, slang } from '@/lib/format'
import { Link } from 'react-router'

export function HomePage(): React.JSX.Element {
  return (
    <>
      <Seo
        title="Cantinho do Açaí - O melhor açaí da região"
        description="Peça já o seu açaí, salgados, paletas e muito mais no Cantinho do Açaí! O melhor açaí da região, com ingredientes frescos e de qualidade. Monte o seu açaí do seu jeito, com diversos acompanhamentos e cremes. Temos também salgados deliciosos, paletas refrescantes e copos da felicidade para adoçar o seu dia. Faça o seu pedido online."
        imgUrl="https://cantinhodoacai.vercel.app/img/novo-logo.png"
      />
      <div className="mx-auto w-11/12 py-20">
        <img
          src="/img/novo-logo.png"
          alt="logo cantinho do açaí"
          className="mx-auto mb-8 h-64 sm:h-72"
        />
        <p className="text-center text-lg text-white/90 mb-8">
          Selecione um produto para começar a montar o seu pedido.
        </p>
        <div className="mx-auto flex w-full flex-col gap-10">
          {Object.entries(categories).map(([name, { path, products, description }]) => (
            <div key={name}>
              <h1 className="font-raleway mb-2 border-b-2 border-amber-600 p-1 text-2xl text-white/90">
                {name}
              </h1>
              <p className="text-white/80 mb-4">{description}</p>
              <div className="gap grid grid-cols-1 gap-4 md:grid-cols-2">
                {products.map(product => (
                  <Link
                    key={slang(product.name)}
                    to={`${path}/${product.slang}`}
                    className="h-[350px] rounded-xl border-2 border-violet-500/90 p-2 transition hover:-translate-y-1 hover:border-amber-400"
                    title={`Selecionar ${product.name}`}
                  >
                    <div className="relative flex h-full justify-center overflow-hidden rounded-xl">
                      <img
                        src={product.img}
                        alt={`Imagem ${product.name}`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/30" />
                      <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-zinc-50/80 p-6">
                        <div>
                          <h2 className="text-xl font-bold text-black">
                            {product.name}
                          </h2>
                          <p className="text md:text-base">
                            {product.people === 1
                              ? 'Serve uma pessoa'
                              : `Serve até ${product.people} pessoas`}
                            .{' '}
                            {!!product.quantity &&
                              `(aprox.${product.quantity}g)`}
                          </p>
                        </div>
                        <div>
                          {product.fullPrice !== product.price && (
                            <span
                              className="font-poppins block text-xl font-semibold tracking-tighter whitespace-nowrap text-zinc-500 line-through"
                              style={{ textDecoration: '' }}
                            >
                              {formatCurrency(product.fullPrice)}
                            </span>
                          )}
                          <span className="font-poppins block text-xl font-semibold tracking-tighter whitespace-nowrap">
                            {formatCurrency(product.price)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
