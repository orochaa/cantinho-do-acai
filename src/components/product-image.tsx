import { cn } from '@/lib/format';

export interface ProductImageProps {
  className?: string;
  loading?: 'eager' | 'lazy';
  product: Product;
}

export function ProductImage(props: ProductImageProps): React.JSX.Element {
  return (
    <img
      alt={`Imagem de ${props.product.name}`}
      className={cn(
        'object-cover',
        props.product.slang.includes('felicidade')
          ? 'object-top'
          : 'object-center',
        props.className,
      )}
      loading={props.loading}
      src={props.product.img}
    />
  );
}
