import type { RefObject } from 'react'
import { useEffect, useState } from 'react'

interface UseIntersectionObserverProps {
  rootMargin?: string
  threshold?: number | number[]
}

export function useIntersectionObserver(
  elementRefs: RefObject<HTMLElement | null>[],
  options?: UseIntersectionObserverProps
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        }
      },
      {
        rootMargin: options?.rootMargin ?? '0px',
        threshold: options?.threshold ?? 0,
      }
    )

    const currentRefs = elementRefs.map(ref => ref.current).filter(Boolean)

    for (const ref of currentRefs) {
      ref && observer.observe(ref)
    }

    return (): void => {
      for (const ref of currentRefs) {
        ref && observer.unobserve(ref)
      }
    }
  }, [elementRefs, options])

  return activeId
}
