import { ProductImage } from '@/components/product-image';

export interface BannerProps {
  product: Product;
}

export function Banner(props: BannerProps): React.JSX.Element {
  return (
    <div className="relative">
      <ProductImage
        product={props.product}
        className="h-60 w-full sm:h-96 sm:max-h-80"
      />
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
}
