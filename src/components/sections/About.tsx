import { ArrowRight } from 'lucide-react'
import { useRef } from 'react'
import { hotel } from '../../config/hotel'
import { featured, getImage } from '../../config/media'
import { useReveal } from '../animations/useReveal'
import { Picture } from '../ui/Picture'
import { TiltStage } from '../ui/TiltStage'
import { Overline, SplitHeading } from '../ui/Typography'

const primary = getImage(featured.aboutPrimary)
const secondary = getImage(featured.aboutSecondary)

const pillars = [
  { title: 'Nature', text: 'Open skies, a great shade tree and a garden that glows after dark.' },
  { title: 'Comfort', text: 'Spacious rooms, polished marble and crisp white linen.' },
  { title: 'Peace', text: 'A calm address away from the bustle, yet easy to reach.' },
]

const ringText = `${hotel.address.locality} · ${hotel.address.city} · ${hotel.address.state} · `

export function About() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <section ref={scope} id="about" aria-labelledby="about-title" className="section-y relative overflow-hidden bg-beige">
      <div className="shell grid items-center gap-16 lg:grid-cols-12 lg:gap-10">
        {/* Story */}
        <div className="lg:col-span-5 lg:pr-6">
          <div data-reveal="up">
            <Overline>Discover Shantione</Overline>
          </div>
          <SplitHeading
            id="about-title"
            className="text-h2 mt-6 text-forest"
            lines={[
              'Quiet rooms,',
              'open skies,',
              <em key="w" className="text-gold-deep">
                warm welcomes.
              </em>,
            ]}
          />
          <div className="text-body mt-8 space-y-5 text-ink-soft">
            <p data-reveal="up">
              {hotel.name} sits on Badalpar Road in {hotel.address.locality}, directly opposite Suktara Airport — an
              easy-to-find, peaceful stop close to {hotel.address.city} city and the wider Pench National Park region.
            </p>
            <p data-reveal="up" data-delay="0.08">
              Inside, light-filled arched corridors lead to spacious rooms with polished marble floors and freshly made
              beds. Meals are served in a bright dining hall, and as evening falls the garden comes alive beneath strings
              of warm lights.
            </p>
          </div>

          <ul data-reveal="items" className="mt-10 grid gap-6 border-t border-forest/15 pt-8 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {pillars.map((p) => (
              <li data-item key={p.title}>
                <p className="font-serif text-2xl text-forest">{p.title}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">{p.text}</p>
              </li>
            ))}
          </ul>

          <a
            data-reveal="up"
            href="#rooms"
            className="group mt-10 inline-flex min-h-11 items-center gap-3 text-[0.78rem] font-bold uppercase tracking-[0.18em] text-forest"
          >
            <span className="border-b border-forest/30 pb-1 transition-colors group-hover:border-forest">See the rooms</span>
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden />
          </a>
        </div>

        {/* Layered photographs */}
        <TiltStage className="relative lg:col-span-7" max={4}>
          <div className="relative mx-auto w-full max-w-[40rem] pb-[18%] lg:ml-auto lg:mr-0">
            <div data-reveal="mask" className="arch relative ml-auto w-[82%] overflow-hidden sm:w-[72%]" style={{ aspectRatio: '3 / 4' }}>
              <div data-parallax="6" className="absolute -inset-y-[8%] inset-x-0">
                <Picture
                  image={primary}
                  sizes="(min-width: 1024px) 34vw, (min-width: 640px) 52vw, 76vw"
                  objectPosition="50% 62%"
                  imgProps={{ 'data-mask-img': true }}
                />
              </div>
            </div>

            <div
              data-reveal="mask"
              className="absolute bottom-0 left-0 w-[48%] overflow-hidden rounded-sm border-[6px] border-beige shadow-[0_30px_60px_-25px_rgba(19,40,28,0.45)] sm:w-[42%] lg:[transform:translateZ(70px)]"
              style={{ aspectRatio: '4 / 5' }}
            >
              <div data-parallax="14" className="absolute -inset-y-[12%] inset-x-0">
                <Picture image={secondary} sizes="(min-width: 1024px) 18vw, 45vw" imgProps={{ 'data-mask-img': true }} />
              </div>
            </div>

            {/* Rotating location seal */}
            <div
              aria-hidden
              className="absolute left-[6%] top-[4%] hidden size-32 sm:block lg:left-[4%] lg:[transform:translateZ(110px)] xl:size-36"
            >
              <svg viewBox="0 0 120 120" className="spin-slow size-full text-forest">
                <defs>
                  <path id="ring" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
                </defs>
                <text className="fill-current text-[9.4px] font-bold uppercase tracking-[0.28em]">
                  <textPath href="#ring">{ringText}</textPath>
                </text>
              </svg>
              <span className="absolute inset-0 m-auto grid size-12 place-items-center rounded-full bg-forest text-gold-light">
                <span className="font-serif text-2xl italic leading-none">S</span>
              </span>
            </div>
          </div>
        </TiltStage>
      </div>
    </section>
  )
}
