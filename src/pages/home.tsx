import { DesktopNav } from '@/components/desktop-nav'
import { ScrollToTopButton } from '@/components/scroll-to-top-button'
import { Seo } from '@/components/seo'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'
import { DESKTOP_BREAKPOINT, useWindowSize } from '@/hooks/use-window-size'
import { categoriesList } from '@/lib/data/categories'
import { formatCurrency, slang } from '@/lib/format'
import { createRef, useMemo } from 'react'
import { Link } from 'react-router'

export function HomePage(): React.JSX.Element {
  const { width } = useWindowSize()
  const isDesktop = width >= DESKTOP_BREAKPOINT

  const sectionRefs = useMemo(
    () => categoriesList.map(() => createRef<HTMLHeadingElement>()),
    []
  )

  const activeId = useIntersectionObserver(sectionRefs, {
    rootMargin: '-20% 0px -80% 0px',
  })

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
        <p className="mb-8 text-center text-lg text-white/90">
          Clique em um produto para começar a montar o seu pedido.
        </p>

        <div className="relative">
          {!!isDesktop && <DesktopNav activeId={activeId} />}

          <main className="flex w-full flex-col gap-10">
            {categoriesList.map((category, index) => (
              <div key={category.slang}>
                <h1
                  id={category.slang}
                  ref={sectionRefs[index]}
                  className="font-raleway scroll-mt-24 border-b-2 border-amber-600 p-1 text-2xl text-white/90"
                >
                  {category.name}
                </h1>
                <p className="mb-4 text-white/80">{category.description}</p>
                <div className="gap grid grid-cols-1 gap-4 md:grid-cols-2">
                  {category.products.map(product => (
                    <Link
                      key={slang(product.name)}
                      to={`${category.slang}/${product.slang}`}
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
          </main>
        </div>

        <ScrollToTopButton className="sticky right-4 bottom-4 ml-auto" />
      </div>
    </>
  )
}
