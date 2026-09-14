/* eslint-disable react/no-multi-comp */

import { formatCurrency } from '@/domain/format';
import type {
  MultipleOptionsEvent,
  MultipleOptionsState,
} from '@/domain/product-personalization';
import { Plus, Trash2 } from 'lucide-react';
import { Container } from './container';
import { QuantityStepper } from './quantity-stepper';

export interface MultipleOptionsSelectorProps<TName extends string> {
  title: string;
  ctx: MultipleOptionsState<TName>;
  dispatchEvent: (event: MultipleOptionsEvent<TName>) => void;
}

export function MultipleOptionsSelector<TName extends string>(
  props: MultipleOptionsSelectorProps<TName>,
): React.JSX.Element {
  const { title, ctx, dispatchEvent } = props;

  return (
    <Container>
      <div className="m-1 text-white">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">Escolha até {ctx.countLimit} opções</p>
      </div>

      <div className="grid auto-rows-[1fr] grid-cols-1 gap-2">
        {ctx.options.map(option => (
          <div
            key={option.name}
            className={`flex items-center rounded-xl border bg-white shadow-sm transition ${option.count > 0 ? 'border-purple-300 bg-purple-50/50' : 'border-zinc-200 hover:border-purple-200 hover:shadow-md'}`}>
            <button
              type="button"
              tabIndex={-1}
              className="flex min-h-14 h-full grow items-center gap-2 p-3 text-left"
              onClick={() => dispatchEvent({ type: 'add', option })}>
              {!!option.img && (
                <div className="flex size-11 shrink-0 items-center overflow-hidden rounded shadow-2xl">
                  <img
                    className="min-h-11 min-w-11 object-center"
                    src={option.img}
                    alt={option.name}
                  />
                </div>
              )}
              <div className="flex flex-col text-left">
                <p className="line-clamp-2 text-base font-medium text-ellipsis md:text-lg">
                  {option.name}
                </p>
                {!!option.price && (
                  <span className="text-sm font-light tracking-tight whitespace-nowrap md:text-base">
                    {formatCurrency(option.price)}
                  </span>
                )}
              </div>
            </button>

            <div className="flex min-h-14 h-full min-w-32 items-center justify-end">
              {option.count === 0 ? (
                <AddOptionButton
                  dispatchEvent={dispatchEvent}
                  option={option}
                  ctx={ctx}
                />
              ) : (
                <QuantitySelector
                  onCountChange={dispatchEvent}
                  item={option}
                  ctx={ctx}
                />
              )}
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

interface AddOptionButtonProps<TName extends string> {
  option: Option<TName>;
  ctx: MultipleOptionsState<TName>;
  dispatchEvent: (event: MultipleOptionsEvent<TName>) => void;
}

function AddOptionButton<TName extends string>(
  props: AddOptionButtonProps<TName>,
): React.JSX.Element {
  const { dispatchEvent, option, ctx } = props;

  return (
    <button
      type="button"
      className="flex min-h-11 min-w-11 h-full items-center flex-1 justify-end rounded-lg py-3 pr-5.75 pl-0 text-purple-700 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700 disabled:text-zinc-400"
      aria-label={`Adicionar ${option.name}`}
      title="Adicionar"
      disabled={ctx.countTotal >= ctx.countLimit}
      onClick={() => dispatchEvent({ type: 'add', option })}>
      <Plus className="size-5" />
    </button>
  );
}

interface QuantitySelectorProps<TName extends string> {
  item: Option<TName>;
  ctx: Pick<MultipleOptionsState<TName>, 'countLimit' | 'countTotal'>;
  onCountChange: (event: MultipleOptionsEvent<TName>) => void;
}

export function QuantitySelector<TName extends string>(
  props: QuantitySelectorProps<TName>,
): React.JSX.Element {
  const { onCountChange, item, ctx } = props;

  return (
    <div className="flex h-full items-center pr-2">
      <QuantityStepper
        count={item.count}
        decreaseIcon={
          item.count === 1 ? <Trash2 className="size-5 shrink-0" /> : null
        }
        decreaseLabel={`${item.count === 1 ? 'Remover' : 'Diminuir'} ${item.name}`}
        decreaseTitle={item.count === 1 ? 'Remover' : 'Diminuir'}
        increaseDisabled={ctx.countTotal >= ctx.countLimit}
        increaseLabel={`Adicionar ${item.name}`}
        increaseTitle="Adicionar"
        onDecrease={() => onCountChange({ type: 'remove', option: item })}
        onIncrease={() => onCountChange({ type: 'add', option: item })}
      />
    </div>
  );
}
