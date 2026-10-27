import { AnimatePresence, motion } from 'motion/react'
import { Expand, Play } from 'lucide-react'
import { useMemo, useRef, useState } from 'react'
import { getImage, getVideo } from '../../config/media'
import {
  galleryFilters,
  galleryItemMedia as itemCopy,
  galleryItems,
  type GalleryFilter,
  type GalleryItem,
  type GallerySpan,
} from '../../data/gallery'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'
import { useReveal } from '../animations/useReveal'
import { Picture } from '../ui/Picture'
import { Overline, SplitHeading } from '../ui/Typography'
import { Lightbox } from './Lightbox'

const spanClass: Record<GallerySpan, string> = {
  feature: 'col-span-2 row-span-2 md:row-span-3',
  tall: 'row-span-2',
  square: 'row-span-1',
  wide: 'col-span-2 row-span-2',
}

const spanSizes: Record<GallerySpan, string> = {
  feature: '(min-width: 768px) 48vw, 95vw',
  wide: '(min-width: 768px) 48vw, 95vw',
  tall: '(min-width: 768px) 24vw, 48vw',
  square: '(min-width: 768px) 24vw, 48vw',
}

function Tile({ item, onOpen }: { item: GalleryItem; onOpen: () => void }) {
  const copy = itemCopy(item)
  const isVideo = item.kind === 'video'
  return (
    <button
      type="button"
      onClick={onOpen}
      data-cursor={isVideo ? 'Play' : 'View'}
      aria-label={`${isVideo ? 'Play video' : 'View photo'}: ${copy.caption}`}
      className="group relative block h-full w-full overflow-hidden rounded-[3px] bg-forest-soft/30 text-left"
    >
      <div data-reveal="mask" className="absolute inset-0 overflow-hidden">
        <div data-parallax="6" className="absolute -inset-y-[8%] inset-x-0">
          {item.kind === 'image' ? (
            <Picture
              image={getImage(item.id)}
              sizes={spanSizes[item.span]}
              objectPosition={item.focus}
              decorative
              className="h-full"
              imgClassName="transition-transform duration-[1300ms] ease-silk group-hover:scale-[1.07]"
              imgProps={{ 'data-mask-img': true }}
            />
          ) : (
            <img
              src={getVideo(item.id).poster}
              width={getVideo(item.id).width}
              height={getVideo(item.id).height}
              alt=""
              loading="lazy"
              decoding="async"
              data-mask-img
              className="h-full w-full object-cover transition-transform duration-[1300ms] ease-silk group-hover:scale-[1.07]"
              style={{ objectPosition: item.focus ?? '50% 50%' }}
            />
          )}
        </div>
      </div>

      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-forest-night/80 via-transparent to-transparent opacity-60 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100"
      />
      <span
        aria-hidden
        className="absolute right-3 top-3 grid size-10 place-items-center rounded-full bg-forest-night/45 text-beige backdrop-blur-sm transition-transform duration-500 ease-silk group-hover:scale-110"
      >
        {isVideo ? <Play className="size-4 translate-x-px fill-current" /> : <Expand className="size-4" />}
      </span>
      <span className="absolute inset-x-0 bottom-0 translate-y-2 p-3 font-serif text-base italic leading-snug text-beige opacity-90 transition-all duration-500 ease-silk group-hover:translate-y-0 group-hover:opacity-100 sm:p-4 sm:text-lg">
        {copy.caption}
      </span>
    </button>
  )
}

export function Gallery() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)
  const reducedMotion = usePrefersReducedMotion()
  const [filter, setFilter] = useState<GalleryFilter>('all')
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const visible = useMemo(
    () => (filter === 'all' ? galleryItems : galleryItems.filter((i) => i.group === filter)),
    [filter],
  )

  return (
    <section
      ref={scope}
      id="gallery"
      aria-labelledby="gallery-title"
      className="grain section-y relative bg-forest-deep text-beige"
    >
      <div className="shell">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div data-reveal="up">
              <Overline tone="light">The Gallery</Overline>
            </div>
            <SplitHeading
              id="gallery-title"
              className="text-h2 mt-6"
              lines={['Every corner,', <em key="g" className="text-gold-light">exactly as it is.</em>]}
            />
          </div>

          <div data-reveal="up" className="-mx-5 overflow-x-auto px-5 no-scrollbar sm:mx-0 sm:px-0">
            <div role="group" aria-label="Filter gallery" className="flex w-max gap-2">
              {galleryFilters.map((f) => {
                const active = f.id === filter
                return (
                  <button
                    key={f.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFilter(f.id)}
                    className={cn(
                      'relative min-h-11 rounded-full px-5 text-[0.75rem] font-bold uppercase tracking-[0.16em] transition-colors duration-300',
                      active ? 'text-forest-night' : 'text-beige/75 hover:text-beige',
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="gallery-filter-pill"
                        className="absolute inset-0 rounded-full bg-gold-light"
                        transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
                      />
                    )}
                    {!active && <span className="absolute inset-0 rounded-full border border-beige/20" />}
                    <span className="relative">{f.label}</span>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <p className="sr-only" aria-live="polite">
          Showing {visible.length} {visible.length === 1 ? 'item' : 'items'}
        </p>

        <motion.ul
          layout={!reducedMotion}
          className="mt-14 grid grid-flow-dense auto-rows-[clamp(8.5rem,24vw,11rem)] grid-cols-2 gap-2.5 sm:gap-3 md:mt-20 md:auto-rows-[clamp(9rem,17vw,17rem)] md:grid-cols-4 md:gap-4"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((item, i) => (
              <motion.li
                key={`${item.kind}-${item.id}`}
                layout={!reducedMotion}
                className={spanClass[item.span]}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.22, 1, 0.36, 1] }}
              >
                <Tile item={item} onOpen={() => setOpenIndex(i)} />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      </div>

      <Lightbox items={visible} index={openIndex} onClose={() => setOpenIndex(null)} onIndexChange={setOpenIndex} />
    </section>
  )
}
