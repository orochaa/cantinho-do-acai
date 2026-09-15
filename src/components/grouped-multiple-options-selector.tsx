import { singularOrPlural } from '@/domain/format';
import type {
  MultipleOptionsEvent,
  MultipleOptionsState,
} from '@/domain/product-personalization';
import { Container } from './container';
import { MultipleOptionRow } from './multiple-options-selector';

export interface MultipleOptionsGroup<TName extends string> {
  title: string;
  options: ReadonlyArray<Option<TName>>;
}

export interface GroupedMultipleOptionsSelectorProps<TName extends string> {
  title: string;
  ctx: MultipleOptionsState<TName>;
  dispatchEvent: (event: MultipleOptionsEvent<TName>) => void;
  groups: ReadonlyArray<MultipleOptionsGroup<TName>>;
}

export function GroupedMultipleOptionsSelector<TName extends string>(
  props: GroupedMultipleOptionsSelectorProps<TName>,
): React.JSX.Element {
  const { title, ctx, dispatchEvent, groups } = props;

  return (
    <Container>
      <div className="m-1 text-white">
        <h2 className="text-xl font-bold">{title}</h2>
        <p className="text-sm">
          Escolha até {singularOrPlural(ctx.countLimit, 'opção', 'opções')}
        </p>
      </div>

      <div className="flex flex-col gap-5">
        {groups.map(group => (
          <section key={group.title}>
            <h3 className="mb-2 text-lg font-semibold text-white">
              {group.title}
            </h3>
            <div className="grid auto-rows-[1fr] grid-cols-1 gap-2 md:grid-cols-2">
              {group.options.map(option => (
                <MultipleOptionRow
                  key={option.name}
                  option={option}
                  ctx={ctx}
                  dispatchEvent={dispatchEvent}
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </Container>
  );
}
