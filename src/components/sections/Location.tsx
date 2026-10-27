import { Copy, Map as MapIcon, MapPin, Navigation, Phone, Plane } from 'lucide-react'
import { useRef, useState } from 'react'
import { fullAddress, hotel } from '../../config/hotel'
import { featured, getImage } from '../../config/media'
import { useInViewport } from '../../hooks/useInViewport'
import { directionsUrl, directionsUseLandmark, phoneHref } from '../../lib/contact'
import { useReveal } from '../animations/useReveal'
import { Button } from '../ui/Button'
import { Picture } from '../ui/Picture'
import { Overline, SplitHeading } from '../ui/Typography'

const photo = getImage(featured.locationImage)

/** Diagrammatic landmark map — shows only verified relationships (hotel opposite the airport on Badalpar Road). */
function SchematicMap() {
  return (
    <figure className="grain relative overflow-hidden rounded-[3px] bg-forest text-beige">
      <svg viewBox="0 0 560 420" className="block h-auto w-full" role="img" aria-labelledby="map-title map-desc">
        <title id="map-title">Schematic location map</title>
        <desc id="map-desc">
          {hotel.name} is on Badalpar Road, directly opposite Suktara Airport. Diagram not to scale.
        </desc>
        <defs>
          <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
            <path d="M28 0H0V28" fill="none" stroke="rgba(244,239,229,0.06)" />
          </pattern>
        </defs>
        <rect width="560" height="420" fill="url(#grid)" />

        {/* Airport */}
        <g transform="translate(70 70) rotate(-8)">
          <rect width="400" height="96" rx="6" fill="rgba(244,239,229,0.05)" stroke="rgba(217,191,143,0.35)" />
          <rect x="24" y="40" width="352" height="16" rx="2" fill="rgba(244,239,229,0.14)" />
          {Array.from({ length: 10 }, (_, i) => (
            <rect key={i} x={44 + i * 34} y="47" width="16" height="2" fill="rgba(19,40,28,0.9)" />
          ))}
        </g>
        <text x="96" y="62" className="fill-gold-light text-[13px] font-bold uppercase tracking-[0.2em]">
          Suktara Airport
        </text>

        {/* Badalpar Road */}
        <path d="M-10 262 C 150 236, 380 236, 570 206" stroke="rgba(244,239,229,0.55)" strokeWidth="18" fill="none" />
        <path d="M-10 262 C 150 236, 380 236, 570 206" stroke="#244a36" strokeWidth="1.5" strokeDasharray="10 12" fill="none" />
        <text x="370" y="270" className="fill-beige/80 text-[12px] font-semibold uppercase tracking-[0.18em]">
          Badalpar Road
        </text>

        {/* Hotel pin — opposite the airport */}
        <g transform="translate(250 312)">
          <circle r="16" className="pin-ping origin-center fill-gold/50" style={{ transformBox: 'fill-box' }} />
          <circle r="7" className="fill-gold" />
          <circle r="3" className="fill-forest-night" />
        </g>
        <text x="274" y="340" className="fill-beige font-serif text-[22px] italic">
          {hotel.name}
        </text>
      </svg>
      <figcaption className="border-t border-beige/10 px-5 py-3 text-[0.72rem] text-beige/65">Diagram — not to scale</figcaption>
    </figure>
  )
}

function MapEmbed({ src }: { src: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const near = useInViewport(ref, { rootMargin: '300px 0px', once: true })
  return (
    <div ref={ref} className="aspect-[4/3] overflow-hidden rounded-[3px] bg-forest/10">
      {near && (
        <iframe
          title={`Map showing ${hotel.name}`}
          src={src}
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      )}
    </div>
  )
}

export function Location() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(`${hotel.name}, ${fullAddress}`)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2200)
    } catch {
      /* Clipboard unavailable — the address remains selectable on screen. */
    }
  }

  return (
    <section ref={scope} id="location" aria-labelledby="location-title" className="section-y bg-white">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div data-reveal="up">
            <Overline>Location &amp; Directions</Overline>
          </div>
          <SplitHeading
            id="location-title"
            className="text-h2 mt-6 text-forest"
            lines={['Easy to find,', <em key="l" className="text-gold-deep">hard to leave.</em>]}
          />

          <div data-reveal="items" className="mt-10 space-y-6">
            <div data-item className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-beige text-forest">
                <MapPin className="size-5" strokeWidth={1.5} aria-hidden />
              </span>
              <address className="not-italic">
                <p className="text-overline text-gold-deep">Address</p>
                <p className="mt-1.5 text-body text-ink">
                  {hotel.name}
                  <br />
                  {hotel.address.line1}
                  <br />
                  {hotel.address.locality}, {hotel.address.city}, {hotel.address.state} – {hotel.address.postalCode}
                </p>
              </address>
            </div>
            <div data-item className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-beige text-forest">
                <Plane className="size-5" strokeWidth={1.5} aria-hidden />
              </span>
              <div>
                <p className="text-overline text-gold-deep">Landmark</p>
                <p className="mt-1.5 text-body text-ink">Directly opposite Suktara Airport, on Badalpar Road.</p>
              </div>
            </div>
            <div data-item className="flex gap-4">
              <span className="grid size-11 shrink-0 place-items-center rounded-full bg-beige text-forest">
                <MapIcon className="size-5" strokeWidth={1.5} aria-hidden />
              </span>
              <div>
                <p className="text-overline text-gold-deep">Nearby</p>
                <p className="mt-1.5 text-body text-ink">{hotel.nearby.join(' · ')}</p>
              </div>
            </div>
          </div>

          <div data-reveal="up" className="mt-10 flex flex-wrap gap-3">
            <Button href={directionsUrl()} external variant="forest" icon={<Navigation className="size-4" aria-hidden />}>
              Get Directions
            </Button>
            {phoneHref && (
              <Button href={phoneHref} variant="outline-dark" icon={<Phone className="size-4" aria-hidden />}>
                Call the Hotel
              </Button>
            )}
            <button
              type="button"
              onClick={copyAddress}
              className="inline-flex min-h-12 items-center gap-2 px-3 text-[0.78rem] font-semibold text-forest underline-offset-4 hover:underline"
            >
              <Copy className="size-4" aria-hidden />
              <span aria-live="polite">{copied ? 'Address copied' : 'Copy address'}</span>
            </button>
          </div>
          {directionsUseLandmark && (
            <p data-reveal="up" className="mt-5 max-w-md text-[0.8rem] leading-relaxed text-ink-soft">
              Directions open Google Maps to Suktara Airport — the hotel is directly opposite, on Badalpar Road.
            </p>
          )}
        </div>

        <div className="relative lg:col-span-6 lg:col-start-7">
          <div data-reveal="up">{hotel.map.embedUrl ? <MapEmbed src={hotel.map.embedUrl} /> : <SchematicMap />}</div>
          <div
            data-reveal="mask"
            className="arch relative -mt-24 ml-auto mr-6 hidden w-[34%] overflow-hidden border-[6px] border-white shadow-xl sm:block"
            style={{ aspectRatio: '3 / 4' }}
          >
            <Picture image={photo} sizes="16vw" imgProps={{ 'data-mask-img': true }} />
          </div>
        </div>
      </div>
    </section>
  )
}
