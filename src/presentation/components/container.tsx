import type { ReactNode } from 'react'

export interface ContainerProps {
  children: ReactNode
}

export function Container(props: ContainerProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2 rounded border border-amber-400/90 p-2 even:border-amber-700">
      {props.children}
    </div>
  )
}
