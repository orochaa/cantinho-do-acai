import { formatCurrency } from '@/domain/format';
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
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-between bg-zinc-50/90 px-5 gap-1 sm:px-6 h-25 sm:h-28">
          <div>
            <h2 className="text-xl font-bold text-black">
              {props.product.name}
            </h2>
            <p className="text-sm text-black md:text-base">
              {props.product.people === 1
                ? 'Serve uma pessoa'
                : `Serve até ${props.product.people} pessoas`}
              {props.product.quantity ? ` · ${props.product.quantity}g` : ''}
            </p>
          </div>
          <div>
            {props.product.fullPrice !== props.product.price && (
              <span className="font-poppins block text-base font-semibold tracking-tighter whitespace-nowrap text-zinc-500 line-through">
                {formatCurrency(props.product.fullPrice)}
              </span>
            )}
            <span className="font-poppins block text-xl font-semibold tracking-tighter whitespace-nowrap text-black">
              {formatCurrency(props.product.price)}
            </span>
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
