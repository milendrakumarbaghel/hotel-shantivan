import { useEffect, useState, type RefObject } from 'react'

interface Options {
  rootMargin?: string
  threshold?: number
  /** Stop observing after the first time the element becomes visible. */
  once?: boolean
}

export function useInViewport<T extends Element>(
  ref: RefObject<T | null>,
  { rootMargin = '0px', threshold = 0, once = false }: Options = {},
) {
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting)
        if (entry.isIntersecting && once) observer.disconnect()
      },
      { rootMargin, threshold },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin, threshold, once])

  return inView
}
