import React, { useCallback, useState } from 'react'
import type { ReactNode } from 'react'

export interface DescriptionProps {
  children: ReactNode
}

export function Description(props: DescriptionProps): React.JSX.Element {
  const [isExpanded, setIsExpanded] = useState(false)

  const handleToggle = useCallback((): void => {
    setIsExpanded(isExpanded => !isExpanded)
  }, [])

  return (
    <button type="button" onClick={handleToggle}>
      <p
        className={`${isExpanded ? 'line-clamp-none' : 'line-clamp-5'} whitespace-pre-line text-pretty text-left`}
      >
        {props.children}
      </p>
      <span className="mt-1 text-center text-sm sm:hidden">
        {isExpanded ? 'mostrar menos' : 'mostrar mais'}
      </span>
    </button>
  )
}
