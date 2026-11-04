import { sorveteCategory } from '@/domain/categories/sorvete';
import { OptionProductsPage } from '@/pages/option-products';

export function SorvetePage(): React.JSX.Element {
  return (
    <OptionProductsPage
      category={sorveteCategory}
      categoryTitle="Sorvetes"
    />
  );
}
