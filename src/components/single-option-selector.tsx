/* eslint-disable react/no-multi-comp */
import { formatCurrency } from '@/domain/format';
import { Container } from './container';

export interface SelectableOptionLike<TName extends string> {
  name: TName;
  isSelected: boolean;
  price?: number;
  img?: string;
}

export interface SingleOptionSelectorProps<
  TName extends string,
  TOption extends SelectableOptionLike<TName> = SelectableOptionLike<TName>,
> {
  title: string;
  ctx: { options: Array<TOption> };
  onSelectionChange: (option: TOption) => void;
}

export function SingleOptionSelector<
  TName extends string,
  TOption extends SelectableOptionLike<TName>,
>(props: SingleOptionSelectorProps<TName, TOption>): React.JSX.Element {
  const { title, ctx, onSelectionChange } = props;

  return (
    <Container>
      <div className="m-1 text-white">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">Escolha uma opção</p>
      </div>

      <div className="grid auto-rows-[1fr] grid-cols-1 gap-2">
        {ctx.options.map(option => (
          <div
            key={option.name}
            className="flex items-center rounded-sm bg-zinc-100 active:bg-zinc-200">
            <button
              type="button"
              className="flex grow items-center gap-2 p-3"
              onClick={() => onSelectionChange(option)}>
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

            <div className="h-14">
              <ToggleOptionButton
                onSelectionChange={onSelectionChange}
                option={option}
              />
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}

interface ToggleOptionButtonProps<
  TName extends string,
  TOption extends SelectableOptionLike<TName>,
> {
  option: TOption;
  onSelectionChange: (option: TOption) => void;
}

function ToggleOptionButton<
  TName extends string,
  TOption extends SelectableOptionLike<TName>,
>(props: ToggleOptionButtonProps<TName, TOption>): React.JSX.Element {
  const { option, onSelectionChange } = props;

  return (
    <button
      type="button"
      aria-label={`${option.isSelected ? 'Selecionado' : 'Selecionar'} ${option.name}`}
      aria-pressed={option.isSelected}
      title={`${option.isSelected ? 'Selecionado' : 'Selecionar'}`}
      className="flex min-h-11 min-w-11 h-full items-center justify-center p-3 pl-0"
      disabled={option.isSelected}
      onClick={() => onSelectionChange(option)}>
      <span
        data-disabled={option.isSelected}
        className="block size-6 rounded-full bg-zinc-200 ring-2 ring-red-500 ring-offset-2 active:bg-red-300 data-[disabled=true]:bg-red-500"
      />
    </button>
  );
}
