import { motion } from 'motion/react'
import { BedDouble, Plane, Snowflake, Sparkles, Trees, UtensilsCrossed, type LucideIcon } from 'lucide-react'
import { useRef } from 'react'
import { visibleAmenities, type AmenityIcon } from '../../data/amenities'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { useReveal } from '../animations/useReveal'
import { Overline, SplitHeading } from '../ui/Typography'

const icons: Record<AmenityIcon, LucideIcon> = {
  snowflake: Snowflake,
  utensils: UtensilsCrossed,
  trees: Trees,
  bed: BedDouble,
  sparkles: Sparkles,
  plane: Plane,
}

export function Amenities() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section ref={scope} id="facilities" aria-labelledby="facilities-title" className="section-y bg-beige">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-10">
        <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
          <div data-reveal="up">
            <Overline>Facilities &amp; Amenities</Overline>
          </div>
          <SplitHeading
            id="facilities-title"
            className="text-h2 mt-6 text-forest"
            lines={['The little', 'things,', <em key="a" className="text-gold-deep">done well.</em>]}
          />
          <p data-reveal="up" className="text-body mt-7 max-w-sm text-ink-soft">
            What you can expect during your stay. For anything specific — early check-in, dietary needs or travel
            plans — simply ask when you enquire.
          </p>
        </div>

        <ul data-reveal="items" className="grid gap-px overflow-hidden rounded-[3px] bg-forest/12 sm:grid-cols-2 lg:col-span-8 xl:grid-cols-3">
          {visibleAmenities.map((amenity, i) => {
            const Icon = icons[amenity.icon]
            return (
              <motion.li
                data-item
                key={amenity.id}
                className="group relative flex min-h-[15rem] flex-col bg-beige p-7 transition-colors duration-500 hover:bg-white sm:p-8"
                initial="rest"
                whileHover={reducedMotion ? undefined : 'hover'}
                animate="rest"
              >
                <div className="flex items-start justify-between">
                  <motion.span
                    className="grid size-14 place-items-center rounded-full border border-gold/50 text-forest"
                    variants={{ rest: { rotate: 0, y: 0 }, hover: { rotate: -8, y: -4 } }}
                    transition={{ type: 'spring', stiffness: 260, damping: 16 }}
                  >
                    <Icon className="size-6" strokeWidth={1.4} aria-hidden />
                  </motion.span>
                  <span className="text-overline text-forest/35">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <h3 className="mt-auto pt-10 font-serif text-[1.65rem] leading-tight text-forest">{amenity.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">{amenity.description}</p>
                <span
                  aria-hidden
                  className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-gold transition-transform duration-700 ease-silk group-hover:scale-x-100"
                />
              </motion.li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
