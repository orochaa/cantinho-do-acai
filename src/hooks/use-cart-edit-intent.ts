import { useCart } from '@/context/cart-provider';
import { useToast } from '@/context/toast-provider';
import type { CartItem } from '@/domain/cart';
import { isCartEditIntent } from '@/lib/navigation';
import { useLocation, useNavigate } from 'react-router';

export function useCartEditIntent(product: Product): {
  item: CartItem | undefined;
  save: (item: Omit<CartItem, 'id' | 'total'>) => void;
} {
  const location = useLocation();
  const navigate = useNavigate();
  const { addCartEvent } = useCart();
  const toast = useToast();
  const intent = isCartEditIntent(location.state) ? location.state : undefined;
  const item =
    intent?.item.product.slang === product.slang ||
    intent?.item.product.name === product.name
      ? intent.item
      : undefined;

  return {
    item,
    save: next => {
      if (item) {
        addCartEvent({ type: 'replace', id: item.id, item: next });
        toast.success({ description: `${product.name} atualizado no pedido.` });
        navigate('/cart');
      }
    },
  };
}
