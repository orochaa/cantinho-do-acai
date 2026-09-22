import { formatCurrency } from '@/domain/format';
import { cn } from '@/lib/format';

export interface ProductPriceProps {
  product: Product;
  className?: string;
  fullPriceClassName?: string;
  priceClassName?: string;
}

export function ProductPrice(props: ProductPriceProps): React.JSX.Element {
  return (
    <div className={cn('text-right', props.className)}>
      {props.product.fullPrice !== props.product.price && (
        <span
          className={cn(
            'font-poppins block text-xs font-semibold tracking-tighter text-zinc-400 line-through sm:text-sm',
            props.fullPriceClassName,
          )}>
          {formatCurrency(props.product.fullPrice)}
        </span>
      )}
      <span
        className={cn(
          'font-poppins block text-base font-bold tracking-tighter text-purple-900 sm:text-lg',
          props.priceClassName,
        )}>
        {formatCurrency(props.product.price)}
      </span>
    </div>
  );
}
