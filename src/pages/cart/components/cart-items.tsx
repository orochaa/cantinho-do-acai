import type { CartItem } from '@/domain/cart';
import { formatCurrency } from '@/domain/format';
import { Pencil, PlusSquare, Trash2 } from 'lucide-react';

export function CartItems(props: {
  cart: ReadonlyArray<CartItem>;
  onRemove: (item: CartItem) => void;
  onEdit: (item: CartItem) => void;
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
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-sm p-2 text-purple-800"
                aria-label={`Editar ${item.product.name}`}
                title="Editar item"
                onClick={() => props.onEdit(item)}>
                <Pencil className="size-5" />
              </button>
              <button
                type="button"
                className="rounded-sm p-2 text-red-700"
                aria-label={`Remover ${item.product.name}`}
                title="Remover item"
                onClick={() => props.onRemove(item)}>
                <Trash2 className="size-5" />
              </button>
            </div>
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
