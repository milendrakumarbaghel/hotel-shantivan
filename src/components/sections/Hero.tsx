import { ArrowDownRight, ArrowRight, Navigation } from 'lucide-react'
import { useRef } from 'react'
import { hotel } from '../../config/hotel'
import { featured, getImage, getVideo } from '../../config/media'
import { directionsUrl, whatsappNumber } from '../../lib/contact'
import { EASE, gsap, MQ, useGSAP } from '../../lib/gsap'
import { useEnquiry } from '../providers/contexts'
import { Button } from '../ui/Button'
import { WhatsAppIcon } from '../ui/Icons'
import { LazyVideo } from '../ui/LazyVideo'
import { Picture } from '../ui/Picture'

const heroVideo = getVideo(featured.heroVideo)
const accentImage = getImage(featured.heroAccent)

/** Seconds after navigation start when the CSS intro curtain begins to lift (see index.css). */
const CURTAIN_LIFT = 1.15

export function Hero() {
  const scope = useRef<HTMLElement>(null)
  const { enquireGeneral } = useEnquiry()

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add({ motion: MQ.motion, desktop: MQ.desktop }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean }
        if (!motion) return

        // ── Entrance ── synced with the intro curtain. If the page hydrated late,
        // the content is simply left visible rather than hidden and replayed.
        const elapsed = performance.now() / 1000
        if (elapsed < CURTAIN_LIFT + 1.2) {
          const tl = gsap.timeline({ delay: Math.max(0, CURTAIN_LIFT - 0.1 - elapsed), defaults: { ease: EASE.silk } })
          // The media is never hidden on phones: as the largest element it should paint (and count as LCP)
          // immediately, under the curtain. Desktop reveals the arch with a clip-path wipe instead.
          tl.from('[data-hero-zoom]', { scale: 1.08, duration: 2.4 }, 0)
          if (desktop) {
            tl.from('[data-hero-media]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.5, ease: 'expo.inOut', clearProps: 'clipPath' }, 0)
              .from('[data-hero-accent]', { clipPath: 'inset(100% 0% 0% 0%)', duration: 1.3, ease: 'expo.inOut', clearProps: 'clipPath' }, 0.45)
              .from('[data-hero-outline]', { autoAlpha: 0, scale: 0.96, duration: 1.6 }, 0.6)
          }
          tl.from('[data-hero-overline]', { autoAlpha: 0, y: 18, duration: 0.8 }, 0.3)
            .from('[data-hero-title] [data-line]', { yPercent: 115, rotate: 2.5, duration: 1.15, stagger: 0.11 }, 0.4)
            // Transform-only (no fade): the paragraph is the mobile LCP element and must paint immediately.
            .from('[data-hero-copy]', { y: 34, duration: 1.1 }, 0.75)
            .from('[data-hero-cta] > *', { autoAlpha: 0, y: 22, duration: 0.8, stagger: 0.09 }, 1.0)
            .from('[data-hero-meta]', { autoAlpha: 0, duration: 0.9 }, 1.25)
        }

        // ── Scroll ── gentle parallax and a modest headline drift.
        const scroll = { trigger: scope.current, start: 'top top', end: 'bottom top', scrub: true }
        gsap.to('[data-hero-parallax]', { yPercent: desktop ? 10 : 6, ease: 'none', scrollTrigger: scroll })
        gsap.to('[data-hero-content]', { y: desktop ? -90 : -40, autoAlpha: 0.25, ease: 'none', scrollTrigger: scroll })
        if (desktop) {
          gsap.to('[data-hero-accent]', { yPercent: -22, ease: 'none', scrollTrigger: scroll })
          gsap.to('[data-hero-watermark]', { xPercent: -6, ease: 'none', scrollTrigger: scroll })
        }
      })
      return () => mm.revert()
    },
    { scope },
  )

  return (
    <section
      ref={scope}
      id="home"
      aria-labelledby="hero-title"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-forest-night text-beige"
    >
      {/* Ambient glow behind the desktop composition */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 hidden bg-[radial-gradient(60%_70%_at_78%_45%,rgba(47,92,69,0.55),transparent_70%)] lg:block"
      />

      {/* Decorative oversized wordmark */}
      <p
        aria-hidden
        data-hero-watermark
        className="pointer-events-none absolute -bottom-[0.18em] left-0 -z-10 hidden whitespace-nowrap font-serif text-[21vw] leading-none text-transparent [-webkit-text-stroke:1px_rgba(217,191,143,0.13)] lg:block"
      >
        {hotel.shortName}
      </p>

      {/* Media — full-bleed on phones & tablets, an arch-framed portrait on desktop */}
      <div className="absolute inset-0 -z-10 lg:inset-auto lg:bottom-[clamp(2.5rem,6vh,4rem)] lg:right-[clamp(2.5rem,7vw,8rem)] lg:top-[clamp(7rem,15vh,9rem)] lg:z-0 lg:aspect-[9/16]">
        <span
          aria-hidden
          data-hero-outline
          className="arch pointer-events-none absolute -inset-3 hidden translate-x-5 -translate-y-3 border border-gold/35 lg:block"
        />
        <div data-hero-media className="absolute inset-0 overflow-hidden lg:arch lg:shadow-[0_40px_80px_-30px_rgba(0,0,0,0.6)]">
          <div data-hero-parallax className="absolute -inset-y-[8%] inset-x-0">
            <div data-hero-zoom className="h-full w-full">
              <LazyVideo video={heroVideo} eager />
            </div>
          </div>
          {/* Readability overlays */}
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-forest-night via-forest-night/75 to-forest-night/45 lg:bg-gradient-to-t lg:from-forest-night/50 lg:via-transparent lg:to-transparent"
          />
        </div>

        <div
          data-hero-accent
          className="arch absolute -left-[42%] bottom-[9%] hidden w-[50%] overflow-hidden border-[6px] border-forest-night shadow-2xl xl:block"
          style={{ aspectRatio: '3 / 4' }}
        >
          <Picture image={accentImage} sizes="14vw" priority objectPosition="50% 30%" decorative />
        </div>
      </div>

      <div className="shell relative flex flex-1 flex-col justify-end pb-28 pt-32 lg:justify-center lg:pb-24 lg:pt-36">
        <div data-hero-content className="max-w-[40rem] lg:max-w-[46%] xl:max-w-[54%]">
          <p data-hero-overline className="text-overline flex items-center gap-3 text-gold-light">
            <span aria-hidden className="h-px w-10 bg-gold-light/60" />
            {hotel.name} · {hotel.address.locality}, {hotel.address.city}
          </p>

          <h1
            id="hero-title"
            data-hero-title
            className="mt-6 font-serif text-[clamp(2.6rem,1.2rem+5.6vw,7.6rem)] font-light leading-[0.95] tracking-[-0.02em] lg:text-[clamp(3rem,0.6rem+5vw,7.6rem)] xl:text-[clamp(2.6rem,1.2rem+5.6vw,7.6rem)]"
          >
            <span className="line-mask block">
              <span data-line className="block">Where Comfort</span>
            </span>
            <span className="line-mask block">
              <span data-line className="block pl-[0.9em] italic text-beige/85">meets</span>
            </span>
            <span className="line-mask block">
              <span data-line className="block italic text-gold-light">Tranquility.</span>
            </span>
          </h1>

          <p data-hero-copy className="text-lead mt-7 max-w-[34rem] text-beige/80">
            A peaceful stay in front of Redbird Airport on Badalpar Road — bright, well-kept rooms, a garden glowing with
            string lights, and warm, unhurried hospitality near Seoni, the NH44 Nagpur Highway and Pench National Park.
          </p>

          <div data-hero-cta className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
            <Button href="#contact" size="lg" icon={<ArrowRight className="size-4" aria-hidden />}>
              Book / Enquire Now
            </Button>
            <Button href={directionsUrl()} external variant="outline-light" size="lg" icon={<Navigation className="size-4" aria-hidden />}>
              Get Directions
            </Button>
            {whatsappNumber && (
              <button
                type="button"
                onClick={enquireGeneral}
                className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-semibold text-beige/85 underline-offset-4 transition-colors hover:text-gold-light hover:underline"
              >
                <WhatsAppIcon className="size-4" /> Enquire on WhatsApp
              </button>
            )}
            <a
              href="#about"
              className="inline-flex min-h-12 items-center gap-2 px-2 text-sm font-semibold text-beige/85 underline-offset-4 transition-colors hover:text-gold-light hover:underline"
            >
              Explore the Stay
            </a>
          </div>
        </div>
      </div>

      <div data-hero-meta className="shell absolute inset-x-0 bottom-0 flex items-end justify-between pb-6 lg:pb-8">
        <a href="#about" className="group flex items-center gap-4 text-beige/70 transition-colors hover:text-beige">
          <span aria-hidden className="relative block h-12 w-px overflow-hidden bg-beige/15">
            <span className="scroll-cue absolute inset-0 bg-gold-light" />
          </span>
          <span className="text-overline">Scroll to explore</span>
          <ArrowDownRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:translate-y-0.5" aria-hidden />
        </a>
        <p className="text-overline hidden text-beige/55 md:block lg:hidden">
          Landmark · {hotel.landmark}
        </p>
      </div>
    </section>
  )
}
