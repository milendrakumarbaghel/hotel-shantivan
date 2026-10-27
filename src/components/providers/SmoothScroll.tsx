import Lenis from 'lenis'
import { useCallback, useEffect, useMemo, useRef, type ReactNode } from 'react'
import { gsap, ScrollTrigger } from '../../lib/gsap'
import { ScrollContext } from './contexts'

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Disabled entirely for visitors who prefer reduced motion (native scrolling).
 * Lenis leaves touch scrolling native, so mobile keeps its familiar feel.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null)
  const lockCount = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 0.95, anchors: false })
    lenisRef.current = lenis
    lenis.on('scroll', ScrollTrigger.update)
    const tick = (time: number) => lenis.raf(time * 1000)
    gsap.ticker.add(tick)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(tick)
      lenis.destroy()
      lenisRef.current = null
    }
  }, [])

  const scrollToId = useCallback((id: string) => {
    const target = document.getElementById(id)
    if (!target) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const focusTarget = () => {
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1')
      target.focus({ preventScroll: true })
    }
    if (id !== 'home') history.replaceState(null, '', `#${id}`)
    else history.replaceState(null, '', window.location.pathname)

    if (lenisRef.current) {
      lenisRef.current.scrollTo(id === 'home' ? 0 : target, { duration: 1.4, onComplete: focusTarget })
    } else {
      target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' })
      focusTarget()
    }
  }, [])

  const setLocked = useCallback((locked: boolean) => {
    lockCount.current = Math.max(0, lockCount.current + (locked ? 1 : -1))
    const shouldLock = lockCount.current > 0
    const root = document.documentElement
    if (shouldLock) {
      const scrollbar = window.innerWidth - root.clientWidth
      root.style.setProperty('--scrollbar-comp', `${scrollbar}px`)
      root.classList.add('scroll-locked')
      lenisRef.current?.stop()
    } else {
      root.classList.remove('scroll-locked')
      root.style.removeProperty('--scrollbar-comp')
      lenisRef.current?.start()
    }
  }, [])

  // Route every in-page anchor (#about, #rooms…) through the smooth scroller.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey) return
      const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[href^="#"]')
      if (!link) return
      const id = link.getAttribute('href')!.slice(1)
      if (!id || !document.getElementById(id)) return
      event.preventDefault()
      scrollToId(id)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [scrollToId])

  // Honour a hash in the URL on first load (e.g. shared link to #rooms).
  useEffect(() => {
    const id = window.location.hash.slice(1)
    if (!id) return
    const timer = window.setTimeout(() => document.getElementById(id)?.scrollIntoView(), 120)
    return () => window.clearTimeout(timer)
  }, [])

  const api = useMemo(() => ({ scrollToId, setLocked }), [scrollToId, setLocked])
  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>
}
