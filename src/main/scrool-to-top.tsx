import { type ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop(props: { children: ReactNode }): React.JSX.Element {
  const location = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [location])

  return <>{props.children}</>
}
