import { QuantitySelector } from '@/components/multiple-options-selector';
import type { CartItem } from '@/context/cart-provider';
import { formatCurrency } from '@/lib/format';
import { PlusSquare } from 'lucide-react';

export function CartItems(props: {
  cart: Array<CartItem>;
  onQuantityChange: (item: CartItem, count: number) => void;
  onRemove: (item: CartItem) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {props.cart.map(item => (
        <div
          key={item.id}
          className="relative flex flex-col gap-2 rounded-sm bg-zinc-50 p-2 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">
              {item.count} - {item.product.name}{' '}
              {!!item.product.price &&
                `- ${formatCurrency(item.product.price)}`}
            </h3>
            <QuantitySelector
              onCountChange={event => {
                if (event.type === 'add') {
                  props.onQuantityChange(item, item.count + 1);
                } else if (item.count > 1) {
                  props.onQuantityChange(item, item.count - 1);
                } else {
                  props.onRemove(item);
                }
              }}
              item={{ name: item.product.name, count: item.count }}
              ctx={{
                countLimit: 15,
                countTotal: props.cart.reduce(
                  (sum, cartItem) => sum + cartItem.count,
                  0,
                ),
              }}
            />
          </div>
          <ul className="flex flex-col gap-1">
            {item.options.map(option => (
              <li
                key={option.name}
                className="flex items-center gap-1">
                <PlusSquare
                  size={20}
                  className="text-pink-600"
                />
                {[
                  option.count,
                  option.name,
                  option.price && formatCurrency(option.price),
                ]
                  .filter(Boolean)
                  .join(' - ')}
              </li>
            ))}
          </ul>
          {!!item.observation && (
            <div>
              <h3 className="font-semibold">Observação:</h3>
              <p className="text-pretty whitespace-pre-line">
                {item.observation}
              </p>
            </div>
          )}
          {item.options.length > 0 && (
            <p className="font-semibold">Total: {formatCurrency(item.total)}</p>
          )}
        </div>
      ))}
    </div>
  );
}
