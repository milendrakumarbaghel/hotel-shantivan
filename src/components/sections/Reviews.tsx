import { AnimatePresence, motion, type PanInfo } from 'motion/react'
import { ArrowLeft, ArrowRight, Star } from 'lucide-react'
import { useRef, useState, type KeyboardEvent } from 'react'
import { hotel } from '../../config/hotel'
import { reviews, type Review } from '../../data/reviews'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { whatsappNumber } from '../../lib/contact'
import { useReveal } from '../animations/useReveal'
import { useEnquiry } from '../providers/contexts'
import { Button } from '../ui/Button'
import { Overline, SplitHeading } from '../ui/Typography'

const ease = [0.22, 1, 0.36, 1] as const

function Stars({ rating }: { rating: NonNullable<Review['rating']> }) {
  return (
    <p className="flex items-center gap-1 text-gold-deep" aria-label={`Rated ${rating} out of 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i} className="size-4" fill={i < rating ? 'currentColor' : 'none'} aria-hidden />
      ))}
    </p>
  )
}

function ReviewCarousel({ items }: { items: Review[] }) {
  const [[index, direction], setState] = useState<[number, number]>([0, 0])
  const reducedMotion = usePrefersReducedMotion()
  const review = items[index]
  const go = (delta: number) => setState(([i]) => [(i + delta + items.length) % items.length, delta])

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') go(1)
    if (e.key === 'ArrowLeft') go(-1)
  }
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x < -60) go(1)
    else if (info.offset.x > 60) go(-1)
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Guest reviews"
      tabIndex={0}
      onKeyDown={onKeyDown}
      className="rounded-sm focus-visible:outline-offset-8"
    >
      <div className="relative min-h-[18rem] overflow-hidden sm:min-h-[16rem]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.figure
            key={review.id}
            role="group"
            aria-roledescription="slide"
            aria-label={`${index + 1} of ${items.length}`}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -60 }}
            transition={{ duration: reducedMotion ? 0.15 : 0.6, ease }}
            drag={items.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={onDragEnd}
            className="cursor-grab active:cursor-grabbing"
          >
            {review.rating && <Stars rating={review.rating} />}
            <blockquote className="mt-6 font-serif text-[clamp(1.6rem,1.2rem+1.5vw,2.6rem)] leading-[1.25] text-forest">
              “{review.quote}”
            </blockquote>
            <figcaption className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink-soft">
              {review.author && <span className="font-semibold text-forest">{review.author}</span>}
              <span className="text-overline text-gold-deep">{review.source}</span>
              {review.date && <span>{review.date}</span>}
            </figcaption>
          </motion.figure>
        </AnimatePresence>
      </div>

      {items.length > 1 && (
        <div className="mt-10 flex items-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            className="grid size-12 place-items-center rounded-full border border-forest/25 text-forest transition-colors hover:bg-forest hover:text-beige"
            aria-label="Previous review"
          >
            <ArrowLeft className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="grid size-12 place-items-center rounded-full border border-forest/25 text-forest transition-colors hover:bg-forest hover:text-beige"
            aria-label="Next review"
          >
            <ArrowRight className="size-4" aria-hidden />
          </button>
          <p className="text-overline ml-2 tabular-nums text-ink-soft" aria-live="polite">
            {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
          </p>
        </div>
      )}
    </div>
  )
}

function EmptyState() {
  const { enquireGeneral } = useEnquiry()
  return (
    <div data-reveal="up" className="max-w-2xl">
      <p className="font-serif text-[clamp(1.6rem,1.2rem+1.5vw,2.5rem)] leading-[1.25] text-forest">
        Guest stories are on their way.
      </p>
      <p className="text-body mt-5 text-ink-soft">
        We only publish genuine reviews from real guests — never written or edited by us. Reviews will appear here once
        they have been verified. Stayed with us recently? We would love to hear how it went.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        {hotel.googleReviewUrl && (
          <Button href={hotel.googleReviewUrl} external variant="forest">
            Review us on Google
          </Button>
        )}
        {whatsappNumber && (
          <Button variant="outline-dark" onClick={enquireGeneral}>
            Share feedback on WhatsApp
          </Button>
        )}
      </div>
    </div>
  )
}

export function Reviews() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <section ref={scope} id="reviews" aria-labelledby="reviews-title" className="section-y relative overflow-hidden bg-beige">
      <span
        aria-hidden
        className="pointer-events-none absolute -top-[0.2em] right-[4vw] select-none font-serif text-[clamp(14rem,30vw,30rem)] leading-none text-forest/[0.06]"
      >
        “
      </span>
      <div className="shell relative grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <div data-reveal="up">
            <Overline>Guest Reviews</Overline>
          </div>
          <SplitHeading
            id="reviews-title"
            className="text-h2 mt-6 text-forest"
            lines={['In our', <em key="v" className="text-gold-deep">guests’ words.</em>]}
          />
        </div>
        <div className="lg:col-span-7 lg:col-start-6 lg:pt-4">
          {reviews.length > 0 ? <ReviewCarousel items={reviews} /> : <EmptyState />}
        </div>
      </div>
    </section>
  )
}
