import { formatCurrency, singularOrPlural } from '@/domain/format';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export interface MenuCardProps {
  href?: string;
  product: Product;
  onClick?: () => void;
}

export function MenuCard(props: MenuCardProps): React.JSX.Element {
  const content = (
    <>
      <div className="relative flex h-full justify-center overflow-hidden rounded-xl">
        <img
          src={props.product.img}
          alt={`Imagem de ${props.product.name}`}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/15 transition-colors group-hover:bg-black/5" />
        <div className="absolute inset-x-0 bottom-0 bg-white/90 flex flex-col gap-1 py-6 px-4">
          <div className="flex items-start justify-between gap-2">
            <h2 className="text-lg leading-tight font-bold text-purple-950">
              {props.product.name}
            </h2>
            <ChevronRight
              aria-hidden="true"
              className="size-5 shrink-0 text-purple-700 transition-transform group-hover:translate-x-0.5"
            />
          </div>
          <div className="flex items-end justify-between gap-2">
            <div className="flex flex-wrap gap-1.5">
              <span className="rounded-full border border-purple-200 bg-white/50 px-2 py-1 text-[0.7rem] font-medium text-purple-800 sm:text-xs">
                {`Serve até ${singularOrPlural(props.product.people, 'pessoa', 'pessoas')}`}
              </span>
              {!!props.product.quantity && (
                <span className="rounded-full border border-purple-200 bg-white/50 px-2 py-1 text-[0.7rem] font-medium text-purple-800 sm:text-xs">
                  {`${props.product.quantity}g`}
                </span>
              )}
            </div>
            <div className="shrink-0 text-right">
              {props.product.fullPrice !== props.product.price && (
                <span className="font-poppins block text-xs font-semibold tracking-tighter text-zinc-400 line-through sm:text-sm">
                  {formatCurrency(props.product.fullPrice)}
                </span>
              )}
              <span className="font-poppins block text-base font-bold tracking-tighter text-purple-900 sm:text-lg">
                {formatCurrency(props.product.price)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
  const className =
    'group block h-87.5 rounded-xl border-2 border-violet-500/90 bg-white/10 p-2 text-left transition hover:-translate-y-1 hover:border-amber-400 focus-visible:border-amber-300';

  return props.onClick ? (
    <button
      type="button"
      className={className}
      title={`Selecionar ${props.product.name}`}
      onClick={props.onClick}>
      {content}
    </button>
  ) : (
    <Link
      className={className}
      title={`Selecionar ${props.product.name}`}
      to={props.href ?? '#'}>
      {content}
    </Link>
  );
}
