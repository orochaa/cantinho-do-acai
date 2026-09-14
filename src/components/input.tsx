import type { ComponentProps } from 'react';
import { tv } from 'tailwind-variants';

const inputStyles = tv({
  base: 'min-h-12 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 hover:border-zinc-300 focus:border-purple-700 focus:ring-4 focus:ring-purple-100 aria-invalid:border-red-500 aria-invalid:focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500',
});

export interface InputProps extends ComponentProps<'input'> {}

export function Input(props: InputProps): React.JSX.Element {
  return (
    <input
      {...props}
      className={inputStyles({ className: props.className })}
    />
  );
}
