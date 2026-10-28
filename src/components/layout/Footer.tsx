import { ArrowUpRight, Mail, Navigation, Phone } from 'lucide-react'
import { useRef } from 'react'
import { hotel } from '../../config/hotel'
import { navItems } from '../../data/navigation'
import { directionsUrl, emailHref, phoneLinks, whatsappNumber } from '../../lib/contact'
import { EASE, gsap, MQ, useGSAP } from '../../lib/gsap'
import { useReveal } from '../animations/useReveal'
import { Button } from '../ui/Button'
import { Monogram, WhatsAppIcon } from '../ui/Icons'

export function Footer() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  // Oversized wordmark rises letter by letter as the footer arrives.
  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      mm.add(MQ.motion, () => {
        gsap.from('[data-wordmark] span', {
          yPercent: 105,
          duration: 1.2,
          ease: EASE.silk,
          stagger: 0.05,
          scrollTrigger: { trigger: '[data-wordmark]', start: 'top 95%', once: true },
        })
      })
      return () => mm.revert()
    },
    { scope },
  )

  const linkClass = 'inline-flex min-h-10 items-center text-beige/75 transition-colors hover:text-gold-light'

  return (
    <footer ref={scope} className="grain relative overflow-hidden bg-forest-night text-beige">
      <div className="shell pt-24 sm:pt-28">
        <div data-reveal="up" className="flex flex-col items-start justify-between gap-8 border-b border-beige/10 pb-16 md:flex-row md:items-end">
          <p className="max-w-xl font-serif text-[clamp(2.2rem,1.4rem+3vw,4.25rem)] leading-[1.02]">
            Ready when you are. <em className="text-gold-light">Stay a while.</em>
          </p>
          <Button href="#contact" size="lg" icon={<ArrowUpRight className="size-4" aria-hidden />}>
            Book / Enquire Now
          </Button>
        </div>

        <div data-reveal="items" className="grid gap-12 py-16 sm:grid-cols-2 lg:grid-cols-12">
          <div data-item className="lg:col-span-3">
            <div className="flex items-center gap-3">
              <Monogram className="h-11 w-auto text-gold-light" />
              <p className="flex flex-col leading-none">
                <span className="text-[0.58rem] font-bold uppercase tracking-[0.42em] text-beige/70">Hotel</span>
                <span className="font-serif text-3xl">{hotel.shortName}</span>
              </p>
            </div>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-beige/65">
              A calm, comfortable stay in Suktara, Seoni — opposite Suktara Airport, close to Seoni city and the Pench
              National Park region.
            </p>
          </div>

          <div data-item className="lg:col-span-3">
            <h2 className="text-overline text-gold-light">Visit</h2>
            <address className="mt-5 text-sm not-italic leading-relaxed text-beige/75">
              {hotel.address.line1}
              <br />
              {hotel.address.locality}, {hotel.address.city}
              <br />
              {hotel.address.state} – {hotel.address.postalCode}, {hotel.address.country}
            </address>
            <a href={directionsUrl()} target="_blank" rel="noopener noreferrer" className={`${linkClass} mt-3 gap-2 text-sm`}>
              <Navigation className="size-4" aria-hidden /> Google Maps directions
            </a>
          </div>

          <div data-item className="lg:col-span-3">
            <h2 className="text-overline text-gold-light">Contact</h2>
            <ul className="mt-5 space-y-1 text-sm">
              {phoneLinks.map((phone) => (
                <li key={phone.href}>
                  <a href={phone.href} className={`${linkClass} gap-2 whitespace-nowrap`}>
                    <Phone className="size-4" aria-hidden /> {phone.label}
                  </a>
                </li>
              ))}
              {whatsappNumber && (
                <li>
                  <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className={`${linkClass} gap-2`}>
                    <WhatsAppIcon className="size-4" /> WhatsApp
                  </a>
                </li>
              )}
              {emailHref && (
                <li>
                  <a href={emailHref} className={`${linkClass} gap-2 break-all`}>
                    <Mail className="size-4 shrink-0" aria-hidden /> {hotel.contact.email}
                  </a>
                </li>
              )}
              <li>
                <a href="#contact" className={linkClass}>
                  Booking enquiry form
                </a>
              </li>
            </ul>
          </div>

          <nav data-item aria-label="Footer" className="lg:col-span-3">
            <h2 className="text-overline text-gold-light">Explore</h2>
            <ul className="mt-5 grid grid-cols-2 gap-x-6 text-sm">
              {navItems.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <p
        aria-hidden
        data-wordmark
        className="line-mask flex select-none justify-center whitespace-nowrap px-2 font-serif text-[clamp(4.5rem,19.5vw,22rem)] leading-[0.8] text-forest-soft/70"
      >
        {hotel.shortName.split('').map((letter, i) => (
          <span key={i} className="inline-block">
            {letter}
          </span>
        ))}
      </p>

      <div className="shell flex flex-col gap-4 border-t border-beige/10 py-8 pb-[max(2rem,env(safe-area-inset-bottom))] text-[0.78rem] text-beige/55 lg:flex-row lg:items-center lg:justify-between">
        <p>
          © {hotel.name}. All Rights Reserved.
        </p>
        <p className="max-w-md lg:text-center">
          {hotel.map.embedUrl
            ? 'This site sets no cookies of its own; the embedded map is provided by Google under its privacy policy.'
            : 'No cookies or tracking. Enquiries go directly from your device to the hotel via WhatsApp.'}
        </p>
        <p>
          Website Designed &amp; Developed by{' '}
          {hotel.developer.url ? (
            <a
              href={hotel.developer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-beige/80 underline-offset-4 hover:text-gold-light hover:underline"
            >
              {hotel.developer.name}
            </a>
          ) : (
            <span className="font-semibold text-beige/80">{hotel.developer.name}</span>
          )}
        </p>
      </div>
    </footer>
  )
}
