import type { ComponentProps } from 'react'
import { tv } from 'tailwind-variants'
import type { VariantProps } from 'tailwind-variants'

const buttonStyles = tv({
  base: 'flex items-center justify-center gap-2 rounded-sm border p-2',
  variants: {
    variant: {
      confirm: 'border-red-300 bg-red-500 text-white disabled:bg-red-500/80',
      cancel: 'border-white bg-zinc-100',
    },
  },
})

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
  )
}
