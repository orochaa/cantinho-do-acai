import { HighlightPill } from '@/components/highlight-pill';
import { ProductPrice } from '@/components/product-price';
import { singularOrPlural } from '@/domain/format';
import type { ResolvedHighlight } from '@/domain/highlights';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router';

export interface CompactMenuCardProps {
  highlight?: ResolvedHighlight;
  href?: string;
  onClick?: () => void;
  product: Product;
}

export function CompactMenuCard(
  props: CompactMenuCardProps,
): React.JSX.Element {
  const content = (
    <>
      <div className="size-22 shrink-0 overflow-hidden rounded-lg sm:size-24">
        <img
          src={props.product.img}
          alt={`Imagem de ${props.product.name}`}
          className="size-full object-cover transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col justify-center">
        <div className="mt-1.5">
          <div className="flex min-w-0 items-start gap-2">
            <h2 className="min-w-0 flex-1 line-clamp-2 text-base leading-tight font-bold text-purple-950 sm:text-lg">
              {props.product.name}
            </h2>
            <ChevronRight
              aria-hidden="true"
              className="mt-0.5 size-4.5 shrink-0 text-purple-900 transition-transform group-hover:translate-x-0.5"
            />
          </div>

          <div className="mt-1.5 flex items-end justify-between gap-2">
            <div className="flex min-w-0 flex-wrap gap-1.5 text-[0.7rem] sm:text-xs">
              <HighlightPill resolved={props.highlight} />
              <span className="rounded-full border border-purple-200 bg-white/50 px-2 py-1 font-medium text-purple-800">
                {`Serve até ${singularOrPlural(props.product.people, 'pessoa', 'pessoas')}`}
              </span>
              {!!props.product.quantity && (
                <span className="rounded-full border border-purple-200 bg-white/50 px-2 py-1 font-medium text-purple-800">
                  {`${props.product.quantity}g`}
                </span>
              )}
            </div>
            <ProductPrice
              className="shrink-0 text-right"
              priceClassName="text-sm sm:text-base"
              product={props.product}
            />
          </div>
        </div>
      </div>
    </>
  );
  const className =
    'group flex w-full items-center gap-3 rounded-xl border border-violet-400/80 bg-white p-2 text-left shadow-md shadow-black/15 transition hover:-translate-y-0.5 hover:border-amber-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-300';

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
