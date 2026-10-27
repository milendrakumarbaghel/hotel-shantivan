import type { RefObject } from 'react'
import { EASE, gsap, MQ, ScrollTrigger, useGSAP } from '../../lib/gsap'

/**
 * Declarative scroll animations for everything inside `scope`.
 *
 *   data-reveal="up"     fade + rise                     (opt. data-delay="0.2")
 *   data-reveal="lines"  children [data-line] slide up out of a mask, staggered
 *   data-reveal="mask"   clip-path wipe from the bottom; child [data-mask-img] settles from 1.2× scale
 *   data-reveal="items"  children [data-item] fade/rise in a staggered batch
 *   data-parallax="12"   scrubbed vertical drift of ±N % (desktop only)
 *
 * Content is fully visible without JavaScript and for reduced-motion visitors:
 * the initial "hidden" states are only applied inside the motion-safe branch.
 * gsap.matchMedia + useGSAP revert every tween and ScrollTrigger on unmount.
 */
export function useReveal(scope: RefObject<HTMLElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean }
        if (!motion) return
        const q = gsap.utils.selector(scope)
        const rise = desktop ? 48 : 28

        q('[data-reveal="up"]').forEach((el) => {
          gsap.from(el, {
            autoAlpha: 0,
            y: rise,
            duration: 0.9,
            ease: EASE.soft,
            delay: Number((el as HTMLElement).dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          })
        })

        q('[data-reveal="lines"]').forEach((el) => {
          gsap.from(el.querySelectorAll('[data-line]'), {
            yPercent: 112,
            rotate: 2,
            duration: 1.05,
            stagger: 0.09,
            ease: EASE.silk,
            delay: Number((el as HTMLElement).dataset.delay ?? 0),
            scrollTrigger: { trigger: el, start: 'top 86%', once: true },
          })
        })

        q('[data-reveal="mask"]').forEach((el) => {
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
          tl.fromTo(
            el,
            { clipPath: 'inset(100% 0% 0% 0%)' },
            { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.25, ease: 'expo.inOut', clearProps: 'clipPath' },
          )
          const img = el.querySelector('[data-mask-img]')
          if (img) tl.from(img, { scale: 1.22, duration: 1.6, ease: EASE.silk }, 0)
        })

        q('[data-reveal="items"]').forEach((group) => {
          const items = group.querySelectorAll('[data-item]')
          gsap.from(items, {
            autoAlpha: 0,
            y: rise * 0.75,
            duration: 0.8,
            stagger: 0.08,
            ease: EASE.soft,
            scrollTrigger: { trigger: group, start: 'top 85%', once: true },
          })
        })

        if (desktop) {
          q('[data-parallax]').forEach((el) => {
            const amount = Number((el as HTMLElement).dataset.parallax) || 10
            gsap.fromTo(
              el,
              { yPercent: -amount },
              {
                yPercent: amount,
                ease: 'none',
                scrollTrigger: { trigger: el.parentElement ?? el, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            )
          })
        }
      })

      return () => mm.revert()
    },
    { scope },
  )
}

/** Call once at the app root: fonts and media shift layout after first paint. */
export function useScrollTriggerRefresh() {
  useGSAP(() => {
    const refresh = () => ScrollTrigger.refresh()
    window.addEventListener('load', refresh, { once: true })
    document.fonts?.ready.then(refresh)
    return () => window.removeEventListener('load', refresh)
  })
}
