import type { CartItem } from '@/domain/cart';
import { formatCurrency } from '@/domain/format';
import { Pencil, Plus, Trash2 } from 'lucide-react';

export function CartItems(props: {
  cart: ReadonlyArray<CartItem>;
  onRemove: (item: CartItem) => void;
  onEdit: (item: CartItem) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      {props.cart.map(item => (
        <div
          key={item.id}
          className="relative flex flex-col gap-2 rounded-xl border border-zinc-100 bg-zinc-50 p-3">
          <div className="flex items-start justify-between gap-2">
            <div>
              <h3 className="font-bold text-zinc-900">{item.product.name}</h3>
              <p className="text-sm text-zinc-500">
                {item.count} {item.count === 1 ? 'unidade' : 'unidades'}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="rounded-lg p-2 text-purple-800 hover:bg-purple-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
                aria-label={`Editar ${item.product.name}`}
                title="Editar item"
                onClick={() => props.onEdit(item)}>
                <Pencil className="size-5" />
              </button>
              <button
                type="button"
                className="rounded-lg p-2 text-red-700 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-700"
                aria-label={`Remover ${item.product.name}`}
                title="Remover item"
                onClick={() => props.onRemove(item)}>
                <Trash2 className="size-5" />
              </button>
            </div>
          </div>
          <ul className="flex flex-col gap-1 text-sm text-zinc-600">
            {item.options.map(option => (
              <li
                key={option.name}
                className="flex items-center gap-1">
                <Plus className="size-4 shrink-0 text-pink-600" />
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
              <h3 className="text-sm font-semibold text-zinc-800">
                Observação
              </h3>
              <p className="text-pretty text-sm whitespace-pre-line text-zinc-600">
                {item.observation}
              </p>
            </div>
          )}
          <p className="border-t border-zinc-200 pt-2 text-right font-bold text-zinc-900">
            {formatCurrency(item.total)}
          </p>
        </div>
      ))}
    </div>
  );
}
