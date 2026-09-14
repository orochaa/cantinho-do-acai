import type { ComponentProps } from 'react';
import { tv } from 'tailwind-variants';

const textareaStyles = tv({
  base: 'min-h-24 w-full resize-y rounded-xl border border-zinc-200 bg-white px-3 py-2.5 text-zinc-900 shadow-sm outline-none transition-[border-color,box-shadow] placeholder:text-zinc-400 hover:border-zinc-300 focus:border-purple-700 focus:ring-4 focus:ring-purple-100 aria-invalid:border-red-500 aria-invalid:focus:ring-red-100 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500',
});

export interface TextareaProps extends ComponentProps<'textarea'> {}

export function Textarea(props: TextareaProps): React.JSX.Element {
  return (
    <textarea
      {...props}
      className={textareaStyles({ className: props.className })}
    />
  );
}
