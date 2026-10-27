import { ArrowUpRight } from 'lucide-react'
import { useRef, useState } from 'react'
import { getImage, getVideo } from '../../config/media'
import { roomTitle, rooms, type Room } from '../../data/rooms'
import { useFinePointer } from '../../hooks/useMediaQuery'
import { whatsappNumber } from '../../lib/contact'
import { cn } from '../../lib/cn'
import { useReveal } from '../animations/useReveal'
import { useEnquiry } from '../providers/contexts'
import { WhatsAppIcon } from '../ui/Icons'
import { LazyVideo } from '../ui/LazyVideo'
import { Picture } from '../ui/Picture'
import { TiltStage } from '../ui/TiltStage'
import { Overline, SplitHeading } from '../ui/Typography'

function RoomCard({ room, index }: { room: Room; index: number }) {
  const { enquireRoom } = useEnquiry()
  const finePointer = useFinePointer()
  const [hovered, setHovered] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const image = getImage(room.image)
  const video = room.video ? getVideo(room.video) : null
  const title = roomTitle(room)
  const number = String(index + 1).padStart(2, '0')
  const showVideo = Boolean(video && finePointer)

  return (
    <article
      data-item
      className={cn('group relative', index % 2 === 1 && 'md:mt-28')}
      onPointerEnter={(e) => e.pointerType === 'mouse' && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      aria-labelledby={`room-${room.id}`}
    >
      <TiltStage max={3}>
        <div className="relative overflow-hidden rounded-[3px] bg-forest/10" style={{ aspectRatio: '4 / 5' }}>
          <div data-parallax="5" className="absolute -inset-y-[6%] inset-x-0">
            <Picture
              image={image}
              sizes="(min-width: 1280px) 40vw, (min-width: 768px) 46vw, 92vw"
              className="h-full"
              imgClassName="transition-transform duration-[1400ms] ease-silk group-hover:scale-[1.06]"
            />
            {showVideo && video && (
              <div
                className={cn(
                  'absolute inset-0 transition-opacity duration-700',
                  hovered && videoReady ? 'opacity-100' : 'opacity-0',
                )}
              >
                <LazyVideo video={video} mode="control" active={hovered} onPlaying={() => setVideoReady(true)} />
              </div>
            )}
          </div>

          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-forest-night/75 via-forest-night/10 to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-100"
          />
          <div className="absolute inset-x-0 top-0 flex items-start justify-between p-5 text-beige sm:p-6">
            <span className="font-serif text-5xl leading-none text-beige/90 sm:text-6xl">{number}</span>
            {video && showVideo && (
              <span className="text-overline rounded-full border border-beige/30 px-3 py-1.5 text-beige/85 backdrop-blur-sm">
                Hover to preview
              </span>
            )}
          </div>
          <div className="absolute inset-x-0 bottom-0 p-5 text-beige sm:p-6">
            <p className="text-overline text-gold-light">Interior {number}</p>
            <p className="mt-2 max-w-[22rem] translate-y-1 text-sm leading-relaxed text-beige/85 transition-transform duration-700 ease-silk group-hover:translate-y-0">
              {image.caption}
            </p>
          </div>
        </div>
      </TiltStage>

      <div className="pt-7">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <h3 id={`room-${room.id}`} className="text-h3 text-forest">
            {title}
          </h3>
          {(room.occupancy || room.price) && (
            <p className="text-sm font-semibold text-gold-deep">
              {[room.occupancy, room.price].filter(Boolean).join(' · ')}
            </p>
          )}
        </div>
        <p className="text-body mt-3 max-w-[34rem] text-ink-soft">{room.description}</p>

        <ul className="mt-5 flex flex-wrap gap-2" aria-label={`Features of ${title}`}>
          {room.features.map((f) => (
            <li key={f} className="rounded-full border border-forest/15 px-3.5 py-1.5 text-[0.78rem] font-medium text-forest/85">
              {f}
            </li>
          ))}
        </ul>

        <div className="mt-7 flex flex-wrap items-center justify-between gap-4 border-t border-forest/10 pt-6">
          {!room.price && <p className="text-[0.8rem] text-ink-soft">Category &amp; tariff shared on enquiry</p>}
          <button
            type="button"
            onClick={() => enquireRoom(title)}
            className="inline-flex min-h-12 items-center gap-2.5 rounded-full border border-forest/30 px-5 text-[0.74rem] font-bold uppercase tracking-[0.16em] text-forest transition-colors duration-300 hover:border-forest hover:bg-forest hover:text-beige group-hover:border-forest"
          >
            {whatsappNumber ? <WhatsAppIcon className="size-4" /> : null}
            Enquire for This Room
            <ArrowUpRight className="size-4" aria-hidden />
          </button>
        </div>
      </div>
    </article>
  )
}

export function Rooms() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <section ref={scope} id="rooms" aria-labelledby="rooms-title" className="section-y bg-white">
      <div className="shell">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-7">
            <div data-reveal="up">
              <Overline>Rooms &amp; Accommodation</Overline>
            </div>
            <SplitHeading
              id="rooms-title"
              className="text-h2 mt-6 text-forest"
              lines={['Rooms made', <em key="r" className="text-gold-deep">for slow mornings.</em>]}
            />
          </div>
          <div className="lg:col-span-5 lg:pb-3">
            <p data-reveal="up" className="text-body max-w-[30rem] text-ink-soft">
              Every room shown here is photographed as it is — generous double beds, polished marble and calm colour.
              Room categories and tariffs are shared personally when you enquire.
            </p>
          </div>
        </div>

        <div data-reveal="items" className="mt-16 grid gap-x-10 gap-y-20 md:mt-24 md:grid-cols-2 lg:gap-x-16 xl:gap-x-24">
          {rooms.map((room, i) => (
            <RoomCard key={room.id} room={room} index={i} />
          ))}
        </div>
      </div>
    </section>
  )
}
