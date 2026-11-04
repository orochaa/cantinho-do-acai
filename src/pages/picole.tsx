import { picoleCategory } from '@/domain/categories/picole';
import { OptionProductsPage } from '@/pages/option-products';

export function PicolePage(): React.JSX.Element {
  return (
    <OptionProductsPage
      category={picoleCategory}
      categoryTitle="Picolés"
    />
  );
}
