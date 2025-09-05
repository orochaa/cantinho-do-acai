import { cn } from '@/lib/format'
import { ArrowUp } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'

interface ScrollToTopButtonProps {
  className?: string
}

export function ScrollToTopButton(
  props: ScrollToTopButtonProps
): React.JSX.Element | null {
  const { className } = props

  const [isVisible, setIsVisible] = useState<boolean>(false)

  useEffect(() => {
    const toggleVisibility = (): void => {
      setIsVisible(window.scrollY > 300)
    }

    window.addEventListener('scroll', toggleVisibility)

    return (): void => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  const scrollToTop = useCallback((): void => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  if (!isVisible) {
    return null
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={cn(
        'z-50 block w-fit rounded-xl bg-amber-500 p-2.5 text-white shadow-lg transition focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
        className
      )}
      aria-label="Voltar ao topo"
    >
      <ArrowUp />
    </button>
  )
}
