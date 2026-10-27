import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { getImage, getVideo } from '../../config/media'
import { galleryItemMedia as itemCopy, type GalleryItem } from '../../data/gallery'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useScrollApi } from '../providers/contexts'
import { Picture } from '../ui/Picture'

interface LightboxProps {
  items: GalleryItem[]
  index: number | null
  onClose: () => void
  onIndexChange: (index: number) => void
}

const ease = [0.22, 1, 0.36, 1] as const

export function Lightbox({ items, index, onClose, onIndexChange }: LightboxProps) {
  const open = index !== null
  const { setLocked } = useScrollApi()
  const reducedMotion = usePrefersReducedMotion()
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const [direction, setDirection] = useState(0)

  const go = useCallback(
    (delta: number) => {
      if (index === null) return
      setDirection(delta)
      onIndexChange((index + delta + items.length) % items.length)
    },
    [index, items.length, onIndexChange],
  )

  // Latest handlers, so the open/close effect below runs exactly once per opening.
  const goRef = useRef(go)
  const closeRefFn = useRef(onClose)
  useEffect(() => {
    goRef.current = go
    closeRefFn.current = onClose
  })

  // Lock scroll, trap focus, keyboard controls, and restore focus on close.
  useEffect(() => {
    if (!open) return
    const opener = document.activeElement as HTMLElement | null
    setLocked(true)
    closeRef.current?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeRefFn.current()
      else if (e.key === 'ArrowRight') goRef.current(1)
      else if (e.key === 'ArrowLeft') goRef.current(-1)
      else if (e.key === 'Tab') {
        const nodes = dialogRef.current?.querySelectorAll<HTMLElement>('button, video[controls], a[href]')
        if (!nodes?.length) return
        const list = Array.from(nodes).filter((n) => n.offsetParent !== null)
        const i = list.indexOf(document.activeElement as HTMLElement)
        if (e.shiftKey && i <= 0) {
          e.preventDefault()
          list[list.length - 1].focus()
        } else if (!e.shiftKey && i === list.length - 1) {
          e.preventDefault()
          list[0].focus()
        }
      }
    }
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      setLocked(false)
      opener?.focus({ preventScroll: true })
    }
  }, [open, setLocked])

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -70 || info.velocity.x < -400) go(1)
    else if (info.offset.x > 70 || info.velocity.x > 400) go(-1)
  }

  const item = index !== null ? items[index] : null
  const copy = item ? itemCopy(item) : null

  return (
    <AnimatePresence>
      {open && item && copy && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          className="fixed inset-0 z-[80] flex flex-col bg-forest-night/97 text-beige"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0 : 0.4, ease }}
        >
          <div className="shell flex items-center justify-between gap-4 pt-[max(1rem,env(safe-area-inset-top))]">
            <p className="text-overline tabular-nums text-gold-light" aria-live="polite">
              {String(index! + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="grid size-12 place-items-center rounded-full border border-beige/20 transition-colors hover:border-gold-light hover:text-gold-light"
              aria-label="Close viewer"
            >
              <X className="size-5" aria-hidden />
            </button>
          </div>

          <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 py-4 sm:px-20">
            <AnimatePresence initial={false} custom={direction} mode="popLayout">
              <motion.figure
                key={`${item.kind}-${item.id}`}
                custom={direction}
                className="flex h-full max-h-full w-full flex-col items-center justify-center"
                initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 80, scale: 0.94 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -80, scale: 0.97 }}
                transition={{ duration: reducedMotion ? 0.15 : 0.55, ease }}
                drag={items.length > 1 ? 'x' : false}
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.18}
                onDragEnd={onDragEnd}
              >
                <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
                  {item.kind === 'image' ? (
                    <Picture
                      image={getImage(item.id)}
                      sizes="(min-width: 768px) 60vw, 95vw"
                      priority
                      className="h-full max-h-full w-auto"
                      imgClassName="!h-full max-h-[calc(100svh-11rem)] w-auto !object-contain select-none"
                      imgProps={{ draggable: false }}
                    />
                  ) : (
                    <video
                      key={item.id}
                      className="max-h-[calc(100svh-11rem)] w-auto rounded-sm"
                      src={getVideo(item.id).src}
                      poster={getVideo(item.id).poster}
                      controls
                      autoPlay={!reducedMotion}
                      muted
                      loop
                      playsInline
                      aria-label={copy.alt}
                    />
                  )}
                </div>
                <figcaption className="mt-4 max-w-xl text-center font-serif text-xl italic text-beige/85 sm:text-2xl">
                  {copy.caption}
                </figcaption>
              </motion.figure>
            </AnimatePresence>

            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  className="absolute left-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-beige/20 bg-forest-night/40 transition-colors hover:border-gold-light hover:text-gold-light sm:grid sm:left-6"
                  aria-label="Previous photo"
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  className="absolute right-2 top-1/2 hidden size-12 -translate-y-1/2 place-items-center rounded-full border border-beige/20 bg-forest-night/40 transition-colors hover:border-gold-light hover:text-gold-light sm:grid sm:right-6"
                  aria-label="Next photo"
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
              </>
            )}
          </div>

          {/* Touch-friendly controls on small screens */}
          {items.length > 1 && (
            <div className="flex items-center justify-center gap-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:hidden">
              <button
                type="button"
                onClick={() => go(-1)}
                className="grid size-12 place-items-center rounded-full border border-beige/20"
                aria-label="Previous photo"
              >
                <ChevronLeft className="size-5" aria-hidden />
              </button>
              <span className="text-xs text-beige/60">Swipe to browse</span>
              <button
                type="button"
                onClick={() => go(1)}
                className="grid size-12 place-items-center rounded-full border border-beige/20"
                aria-label="Next photo"
              >
                <ChevronRight className="size-5" aria-hidden />
              </button>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
