export interface TitledGroup<TOption> {
  title: string;
  options: Array<TOption>;
}

const insertByName = <TOption extends { name: string }>(
  options: Array<TOption>,
  option: TOption,
): void => {
  let low = 0;
  let high = options.length;

  while (low < high) {
    const middle = low + Math.floor((high - low) / 2);
    if (options[middle].name.localeCompare(option.name, 'pt-BR') <= 0) {
      low = middle + 1;
    } else {
      high = middle;
    }
  }

  options.splice(low, 0, option);
};

export const groupOptionBy = <TOption extends { name: string }>(
  options: ReadonlyArray<TOption>,
  getTitle: (option: TOption) => string,
): Array<TitledGroup<TOption>> => {
  const groups = new Map<string, TitledGroup<TOption>>();

  for (const option of options) {
    const title = getTitle(option);
    const group = groups.get(title);
    if (group) {
      insertByName(group.options, option);
    } else {
      groups.set(title, { title, options: [option] });
    }
  }

  return [...groups.values()];
};
