export type SelectableOption<TName extends string> = Option<TName> & {
  isSelected: boolean;
};

export type InitialSelectableOption<TName extends string> = Optional<
  Omit<SelectableOption<TName>, 'count'>,
  'isSelected'
>;
