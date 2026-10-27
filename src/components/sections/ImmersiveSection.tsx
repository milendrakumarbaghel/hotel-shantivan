import { ArrowRight } from 'lucide-react'
import { lazy, Suspense, useRef } from 'react'
import { featured, getImage, getVideo, type ImageId } from '../../config/media'
import { useDeviceProfile } from '../../hooks/useDeviceProfile'
import { useInViewport } from '../../hooks/useInViewport'
import { cn } from '../../lib/cn'
import { gsap, MQ, useGSAP } from '../../lib/gsap'
import { useReveal } from '../animations/useReveal'
import { ErrorBoundary } from '../ui/ErrorBoundary'
import { LazyVideo } from '../ui/LazyVideo'
import { Picture } from '../ui/Picture'
import { Overline, SplitHeading } from '../ui/Typography'

const LanternField = lazy(() => import('../three/LanternField'))

/** Photographs hung along the virtual corridor: x in vw, y in vh, z in px (negative = further away). */
const FRAMES: { id: ImageId; x: number; y: number; z: number; arch?: boolean }[] = [
  { id: 'entrance-welcome-still', x: -27, y: 4, z: -300, arch: true },
  { id: 'corridor-symmetry-still', x: 27, y: -6, z: -1000 },
  { id: 'room-coral', x: -29, y: -4, z: -1700 },
  { id: 'dining-hall-still', x: 28, y: 6, z: -2400, arch: true },
  { id: 'room-blush', x: -28, y: 6, z: -3100, arch: true },
  { id: 'garden-lights-night', x: 29, y: -5, z: -3800 },
  { id: 'room-mist', x: -27, y: -3, z: -4500 },
  { id: 'exterior-signage-night', x: 28, y: 3, z: -5200, arch: true },
]
const FINAL_Z = -6100
const CAMERA_TRAVEL = -FINAL_Z
const PERSPECTIVE = 1000

const phrases = [
  { k: 'I', text: 'Arrive through the welcome arch.' },
  { k: 'II', text: 'Wander bright, arched corridors.' },
  { k: 'III', text: 'Settle into a calm, colourful room.' },
]

const finalVideo = getVideo(featured.immersiveVideo)

/** Desktop: scroll-driven CSS-3D walk with an optional WebGL light layer. */
function CorridorScene() {
  const track = useRef<HTMLDivElement>(null)
  const progress = useRef(0)
  const { rich } = useDeviceProfile()
  const near = useInViewport(track, { rootMargin: '600px 0px', once: true })
  const inView = useInViewport(track)

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(`${MQ.desktop} and ${MQ.motion}`, () => {
        const q = gsap.utils.selector(track)
        const camera = q('[data-camera]')[0]
        const frames = q('[data-frame]') as HTMLElement[]
        const phraseEls = q('[data-phrase]') as HTMLElement[]

        const setFrameOpacity = frames.map((f) => gsap.quickSetter(f, 'opacity'))
        const depths = frames.map((f) => Number(f.dataset.z))

        // Fog in the distance, fade out just before a frame would pass the viewer.
        const updateFrames = (cameraZ: number) => {
          depths.forEach((z, i) => {
            const world = z + cameraZ
            const fogIn = gsap.utils.clamp(0, 1, (world + 3600) / 1800)
            const passOut = gsap.utils.clamp(0, 1, (650 - world) / 350)
            setFrameOpacity[i](Math.min(fogIn, passOut))
            frames[i].style.visibility = world > 640 ? 'hidden' : 'visible'
          })
        }

        const state = { z: 0 }
        const tl = gsap.timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: track.current,
            start: 'top top',
            end: 'bottom bottom',
            scrub: 0.8,
            onUpdate: (self) => {
              progress.current = self.progress
            },
          },
        })

        tl.to(
          state,
          {
            z: CAMERA_TRAVEL,
            duration: 1,
            onUpdate: () => {
              gsap.set(camera, { z: state.z })
              updateFrames(state.z)
            },
          },
          0,
        )

        phraseEls.forEach((el, i) => {
          const start = 0.04 + i * 0.25
          tl.fromTo(el, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.07, ease: 'power2.out' }, start)
          tl.to(el, { autoAlpha: 0, y: -40, duration: 0.06, ease: 'power2.in' }, start + 0.17)
        })

        tl.fromTo('[data-final-copy]', { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.08 }, 0.8).to(
          '[data-to-beige]',
          { opacity: 1, duration: 0.07 },
          0.93,
        )

        updateFrames(0)
      })
      return () => mm.revert()
    },
    { scope: track },
  )

  return (
    <div ref={track} className="relative hidden h-[360vh] lg:motion-safe:block">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        {/* WebGL light layer (or a quiet CSS glow when WebGL is unavailable / not worth it) */}
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(50%_45%_at_50%_45%,rgba(197,164,109,0.12),transparent_70%)]" />
        {rich && near && (
          <div aria-hidden className="absolute inset-0">
            <ErrorBoundary fallback={null}>
              <Suspense fallback={null}>
                <LanternField progress={progress} active={inView} />
              </Suspense>
            </ErrorBoundary>
          </div>
        )}

        {/* CSS 3D corridor */}
        <div aria-hidden className="absolute inset-0" style={{ perspective: `${PERSPECTIVE}px`, perspectiveOrigin: '50% 45%' }}>
          <div data-camera className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]">
            {FRAMES.map((f) => {
              const image = getImage(f.id)
              return (
                <div
                  key={f.id}
                  data-frame
                  data-z={f.z}
                  className={cn(
                    'absolute overflow-hidden shadow-[0_40px_80px_-30px_rgba(0,0,0,0.7)] will-change-[opacity]',
                    f.arch ? 'arch' : 'rounded-[3px]',
                  )}
                  style={{
                    width: 'clamp(15rem, 19vw, 21rem)',
                    aspectRatio: '3 / 4',
                    transform: `translate(-50%, -50%) translate3d(${f.x}vw, ${f.y}vh, ${f.z}px) rotateY(${f.x > 0 ? -14 : 14}deg)`,
                  }}
                >
                  <Picture image={image} sizes="21rem" decorative />
                  <div className="absolute inset-0 bg-forest-night/15" />
                </div>
              )
            })}
            <div
              data-frame
              data-z={FINAL_Z}
              className="arch absolute overflow-hidden border border-gold/30 shadow-[0_50px_100px_-30px_rgba(0,0,0,0.8)]"
              style={{
                width: 'clamp(17rem, 22vw, 24rem)',
                aspectRatio: '9 / 16',
                transform: `translate(-50%, -50%) translate3d(14vw, 0, ${FINAL_Z}px)`,
              }}
            >
              <LazyVideo video={finalVideo} />
            </div>
          </div>
        </div>

        {/* Narrative (visual); the same lines are listed for screen readers below */}
        <ol className="sr-only">
          {phrases.map((p) => (
            <li key={p.k}>{p.text}</li>
          ))}
        </ol>
        <div aria-hidden className="pointer-events-none absolute inset-0 grid place-items-center">
          {phrases.map((p) => (
            <p key={p.k} data-phrase className="invisible absolute max-w-[30rem] px-6 text-center font-serif text-[clamp(2.4rem,1.5rem+2.4vw,4rem)] italic leading-[1.05] text-beige [text-shadow:0_2px_30px_rgba(19,40,28,0.8)]">
              <span className="text-overline mb-5 block not-italic text-gold-light">{p.k}</span>
              {p.text}
            </p>
          ))}
        </div>

        <div data-final-copy className="invisible absolute inset-y-0 left-0 flex w-1/2 items-center">
          <div className="shell !max-w-none pl-[clamp(2.5rem,7vw,8rem)]">
            <p className="text-overline text-gold-light">Step inside</p>
            <p className="mt-5 font-serif text-[clamp(2.8rem,1.6rem+3.6vw,5.6rem)] leading-[0.98] text-beige">
              Then simply,
              <br />
              <em className="text-gold-light">rest.</em>
            </p>
            <a
              href="#contact"
              className="pointer-events-auto mt-8 inline-flex min-h-12 items-center gap-3 rounded-full bg-gold px-7 text-[0.78rem] font-bold uppercase tracking-[0.16em] text-forest-night transition-colors hover:bg-gold-light"
            >
              Plan your stay <ArrowRight className="size-4" aria-hidden />
            </a>
          </div>
        </div>

        {/* Dark-green → beige hand-off into the next section */}
        <div data-to-beige aria-hidden className="pointer-events-none absolute inset-0 bg-beige opacity-0" />
      </div>
    </div>
  )
}

/** Phones, tablets and reduced-motion: an editorial, static layered composition. */
function StaticComposition() {
  const images: ImageId[] = ['corridor-symmetry-still', 'room-azure', 'garden-lights-night']
  return (
    <div className="relative pb-24 pt-4 lg:motion-safe:hidden">
      <div className="shell">
        <ol data-reveal="items" className="grid gap-6 border-t border-beige/15 pt-8 sm:grid-cols-3">
          {phrases.map((p) => (
            <li data-item key={p.k} className="font-serif text-2xl italic leading-snug text-beige/90 sm:text-[1.7rem]">
              <span className="text-overline mb-3 block not-italic text-gold-light">{p.k}</span>
              {p.text}
            </li>
          ))}
        </ol>

        <div className="relative mt-16 flex items-end justify-center gap-3 [perspective:900px] sm:gap-6">
          {images.map((id, i) => (
            <div
              key={id}
              data-reveal="mask"
              className={cn(
                'overflow-hidden shadow-2xl',
                i === 1 ? 'arch z-10 w-[44%] max-w-[22rem]' : 'w-[28%] max-w-[15rem] rounded-[3px]',
                i === 0 && '[transform:rotateY(16deg)]',
                i === 2 && '[transform:rotateY(-16deg)]',
              )}
              style={{ aspectRatio: i === 1 ? '3 / 4.6' : '3 / 4' }}
            >
              <Picture image={getImage(id)} sizes="(min-width: 640px) 30vw, 44vw" imgProps={{ 'data-mask-img': true }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function ImmersiveSection() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <section
      ref={scope}
      id="experience"
      aria-labelledby="experience-title"
      className="grain relative bg-forest-night text-beige"
    >
      <div className="shell pt-[clamp(5.5rem,4rem+7vw,11rem)] lg:pb-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div data-reveal="up">
              <Overline tone="light">A Walk Through Shantivan</Overline>
            </div>
            <SplitHeading
              id="experience-title"
              className="text-h2 mt-6"
              lines={['Light, arches', <em key="e" className="text-gold-light">and stillness.</em>]}
            />
          </div>
          <p data-reveal="up" className="text-body max-w-md text-beige/75 lg:col-span-5 lg:pb-3">
            From the welcome arch to a quiet room at the end of a bright corridor — Shantivan, exactly as you will find
            it.
          </p>
        </div>
      </div>

      <CorridorScene />
      <StaticComposition />

      {/* Soft fade into the beige section that follows (mobile / reduced motion) */}
      <div aria-hidden className="h-24 bg-gradient-to-b from-forest-night to-beige lg:motion-safe:hidden" />
    </section>
  )
}
