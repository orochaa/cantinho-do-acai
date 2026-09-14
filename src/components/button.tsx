import type { ComponentProps } from 'react';
import { tv, type VariantProps } from 'tailwind-variants';

const buttonStyles = tv({
  base: 'flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 py-2 font-semibold shadow-sm transition-[background-color,border-color,box-shadow,transform] hover:shadow-md focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-purple-200 disabled:pointer-events-none disabled:shadow-none',
  variants: {
    variant: {
      confirm:
        'border-red-300 bg-red-500 text-white focus-visible:border-white focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-red-500 disabled:bg-red-500/80',
      checkout:
        'border-purple-950 bg-purple-900 text-white focus-visible:border-white focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-purple-950 hover:bg-purple-800 disabled:border-purple-900/50 disabled:bg-purple-900/60',
      cancel: 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300 ',
    },
  },
});

export interface ButtonProps
  extends VariantProps<typeof buttonStyles>,
    ComponentProps<'button'> {}

export function Button(props: ButtonProps): React.JSX.Element {
  return (
    <button
      type="button"
      {...props}
      className={buttonStyles({
        variant: props.variant,
        className: props.className,
      })}
    />
  );
}
