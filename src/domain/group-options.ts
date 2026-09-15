export interface TitledGroup<TOption> {
  title: string;
  options: Array<TOption>;
}

export const groupOptionBy = <TOption extends { name: string }>(
  options: ReadonlyArray<TOption>,
  getTitle: (option: TOption) => string,
): Array<TitledGroup<TOption>> => {
  const groups = new Map<string, TitledGroup<TOption>>();
  const groupedOptions: Array<TitledGroup<TOption>> = [];

  for (const option of options) {
    const title = getTitle(option);
    const group = groups.get(title);
    if (group) {
      group.options.push(option);
    } else {
      const newGroup = { title, options: [option] };
      groups.set(title, newGroup);
      groupedOptions.push(newGroup);
    }
  }

  for (const group of groupedOptions) {
    group.options.sort((first, second) =>
      first.name.localeCompare(second.name, 'pt-BR'),
    );
  }

  return groupedOptions;
};
