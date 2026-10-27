import { useEffect, useRef, useSyncExternalStore } from 'react'
import type { VideoAsset } from '../../config/media'
import { prefersReducedData } from '../../hooks/useDeviceProfile'
import { useInViewport } from '../../hooks/useInViewport'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'

interface LazyVideoProps {
  video: VideoAsset
  className?: string
  /**
   * 'inview'  — plays (muted, looped) while on screen, pauses when off screen.
   * 'control' — plays only while `active` is true (e.g. on card hover).
   */
  mode?: 'inview' | 'control'
  active?: boolean
  /** Above-the-fold: attach the source immediately instead of waiting for proximity. */
  eager?: boolean
  objectPosition?: string
  /** Decorative background videos are hidden from assistive tech. */
  decorative?: boolean
  onPlaying?: () => void
}

const noopSubscribe = () => () => {}

/**
 * Decorative, always-muted video that:
 *  - attaches its source only when close to the viewport (no eager downloads),
 *  - pauses when off screen to save battery,
 *  - falls back to its poster for reduced-motion / data-saver visitors.
 */
export function LazyVideo({
  video,
  className,
  mode = 'inview',
  active = false,
  eager = false,
  objectPosition = '50% 50%',
  decorative = true,
  onPlaying,
}: LazyVideoProps) {
  const ref = useRef<HTMLVideoElement>(null)
  const near = useInViewport(ref, { rootMargin: '300px 0px', once: true })
  const visible = useInViewport(ref, { threshold: 0.05 })
  const reducedMotion = usePrefersReducedMotion()
  // The server snapshot says "reduced data" so nothing is fetched before hydration.
  const reducedData = useSyncExternalStore(noopSubscribe, prefersReducedData, () => true)

  const canPlay = !reducedData && !reducedMotion
  const shouldLoad = canPlay && (eager || near)
  const shouldPlay = canPlay && visible && (mode === 'inview' || active)

  useEffect(() => {
    const el = ref.current
    if (!el || !shouldLoad) return
    el.muted = true
    if (shouldPlay) {
      el.play().catch(() => {
        /* Autoplay can be refused (e.g. Low Power Mode) — the poster remains. */
      })
    } else {
      el.pause()
    }
  }, [shouldLoad, shouldPlay])

  return (
    <video
      ref={ref}
      className={cn('h-full w-full object-cover', className)}
      style={{ objectPosition }}
      poster={video.poster}
      width={video.width}
      height={video.height}
      src={shouldLoad ? video.src : undefined}
      muted
      loop
      playsInline
      disablePictureInPicture
      preload={shouldLoad ? 'auto' : 'none'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : video.alt}
      tabIndex={-1}
      onPlaying={onPlaying}
    />
  )
}
