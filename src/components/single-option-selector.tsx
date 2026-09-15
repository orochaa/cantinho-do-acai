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
  bare?: boolean;
}

export function SingleOptionSelector<
  TName extends string,
  TOption extends SelectableOptionLike<TName>,
>(props: SingleOptionSelectorProps<TName, TOption>): React.JSX.Element {
  const { title, ctx, onSelectionChange } = props;

  const content = (
    <>
      <div className={`m-1 ${props.bare ? 'text-zinc-900' : 'text-white'}`}>
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">Escolha uma opção</p>
      </div>

      <div className="grid auto-rows-[1fr] grid-cols-1 gap-2">
        {ctx.options.map(option => (
          <SingleOptionRow
            key={option.name}
            option={option}
            onSelectionChange={onSelectionChange}
          />
        ))}
      </div>
    </>
  );

  return props.bare ? (
    <div className="flex flex-col gap-3">{content}</div>
  ) : (
    <Container>{content}</Container>
  );
}

interface SingleOptionRowProps<
  TName extends string,
  TOption extends SelectableOptionLike<TName>,
> {
  option: TOption;
  onSelectionChange: (option: TOption) => void;
}

function SingleOptionRow<
  TName extends string,
  TOption extends SelectableOptionLike<TName>,
>(props: SingleOptionRowProps<TName, TOption>): React.JSX.Element {
  const { option, onSelectionChange } = props;

  return (
    <div className="flex items-center rounded-xl border border-zinc-200 bg-white shadow-sm transition hover:border-purple-200 hover:shadow-md">
      <button
        type="button"
        tabIndex={-1}
        className="flex min-h-14 grow items-center gap-3 p-3 text-left"
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

      <ToggleOptionButton
        onSelectionChange={onSelectionChange}
        option={option}
      />
    </div>
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
      className="flex min-h-11 min-w-11 h-full items-center justify-center p-3 rounded-lg pl-0 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-700"
      disabled={option.isSelected}
      onClick={() => onSelectionChange(option)}>
      <span
        data-disabled={option.isSelected}
        className="block size-5 rounded-full bg-zinc-100 ring-2 ring-purple-700 ring-offset-2 transition-colors active:bg-purple-200 data-[disabled=true]:bg-purple-700"
      />
    </button>
  );
}
