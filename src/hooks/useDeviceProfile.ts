import { useMemo } from 'react'
import { useFinePointer, useIsDesktop, usePrefersReducedMotion } from './useMediaQuery'

interface NetworkInformation {
  saveData?: boolean
  effectiveType?: string
}

/** Reads data-saver / slow-network hints where the browser exposes them. */
export function prefersReducedData(): boolean {
  if (typeof navigator === 'undefined') return false
  const connection = (navigator as Navigator & { connection?: NetworkInformation }).connection
  if (connection?.saveData) return true
  if (connection?.effectiveType && /(^|-)2g$/.test(connection.effectiveType)) return true
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-data: reduce)').matches
}

/**
 * Decides how rich the experience should be on this device.
 * `rich` gates the heaviest effects (WebGL, pinned 3D scene, cursor follower).
 */
export function useDeviceProfile() {
  const reducedMotion = usePrefersReducedMotion()
  const desktop = useIsDesktop()
  const finePointer = useFinePointer()

  return useMemo(() => {
    const cores = typeof navigator !== 'undefined' ? (navigator.hardwareConcurrency ?? 4) : 4
    const memory = typeof navigator !== 'undefined' ? ((navigator as { deviceMemory?: number }).deviceMemory ?? 8) : 8
    const lowPower = cores < 4 || memory < 4
    const reducedData = prefersReducedData()
    return {
      reducedMotion,
      desktop,
      finePointer,
      reducedData,
      lowPower,
      rich: desktop && !reducedMotion && !lowPower && !reducedData,
    }
  }, [reducedMotion, desktop, finePointer])
}
