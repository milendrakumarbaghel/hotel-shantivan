import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger, useGSAP)
  gsap.defaults({ ease: 'power3.out', duration: 0.9 })
  ScrollTrigger.config({ ignoreMobileResize: true })
}

/** Shared easing vocabulary — restrained, natural movement. */
export const EASE = {
  silk: 'expo.out',
  soft: 'power3.out',
  inOut: 'power2.inOut',
} as const

/** Media query conditions used with gsap.matchMedia(). */
export const MQ = {
  motion: '(prefers-reduced-motion: no-preference)',
  reduce: '(prefers-reduced-motion: reduce)',
  desktop: '(min-width: 1024px)',
  mobile: '(max-width: 1023.98px)',
  finePointer: '(hover: hover) and (pointer: fine)',
} as const

export { gsap, ScrollTrigger, useGSAP }
