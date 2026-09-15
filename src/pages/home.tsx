import { CategoryCard } from '@/components/category-card';
import { Seo } from '@/components/seo';
import { companyInfo } from '@/domain/company';
import { visibleMenu } from '@/domain/menu';

const socialLinkClassName =
  'grid size-11 place-items-center rounded-xl border border-white/35 bg-white/10 text-white transition hover:border-white hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white';

export function HomePage(): React.JSX.Element {
  return (
    <>
      <Seo
        title="Cantinho do Açaí - O melhor açaí da região"
        description="Peça já o seu açaí, salgados, paletas e muito mais no Cantinho do Açaí! O melhor açaí da região, com ingredientes frescos e de qualidade. Monte o seu açaí do seu jeito, com diversos acompanhamentos e cremes. Temos também salgados deliciosos, paletas refrescantes e copos da felicidade para adoçar o seu dia. Faça o seu pedido online."
        imgUrl="https://cantinhodoacai.vercel.app/img/novo-logo.png"
      />
      <div className="mx-auto w-11/12 max-w-5xl pt-24 pb-12 lg:pt-13.5 sm:pb-24">
        <img
          src="/img/novo-logo.png"
          alt="Logo Cantinho do Açaí"
          className="mx-auto mb-6 h-48 sm:h-64"
        />
        <p className="mx-auto mb-10 max-w-xl text-center text-lg text-white/90">
          Escolha uma categoria para começar a montar o seu pedido.
        </p>
        <nav
          aria-label="Redes sociais e localização"
          className="mb-10 flex justify-center gap-3">
          <a
            aria-label="Instagram"
            className={socialLinkClassName}
            href={companyInfo.instagramUrl}
            rel="noreferrer"
            target="_blank"
            title="Instagram">
            <img
              alt=""
              aria-hidden="true"
              className="size-5 brightness-0 invert"
              src="/svg/instagram.svg"
            />
            <span className="sr-only">Instagram</span>
          </a>
          <a
            aria-label="WhatsApp"
            className={socialLinkClassName}
            href={`https://wa.me/${companyInfo.whatsappPhone}`}
            rel="noreferrer"
            target="_blank"
            title="WhatsApp">
            <img
              alt=""
              aria-hidden="true"
              className="size-5 brightness-0 invert"
              src="/svg/whatsapp.svg"
            />
            <span className="sr-only">WhatsApp</span>
          </a>
          <a
            aria-label="Localização no Google Maps"
            className={socialLinkClassName}
            href={companyInfo.googleMapsUrl}
            rel="noreferrer"
            target="_blank"
            title="Localização no Google Maps">
            <img
              alt=""
              aria-hidden="true"
              className="size-5 brightness-0 invert"
              src="/svg/maps.svg"
            />
            <span className="sr-only">Localização no Google Maps</span>
          </a>
        </nav>

        <main>
          <h1 className="mb-5 text-center text-2xl font-bold text-white sm:text-3xl">
            O que você deseja hoje?
          </h1>
          <div className="grid grid-cols-2  gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {visibleMenu.map((entry, index) => {
              const product = entry.products[0];
              return product ? (
                <CategoryCard
                  href={`/${entry.route}`}
                  image={product.img}
                  key={entry.route}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  name={entry.name}
                />
              ) : null;
            })}
          </div>
        </main>
      </div>
    </>
  );
}
