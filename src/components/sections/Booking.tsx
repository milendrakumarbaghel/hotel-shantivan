import { Mail, Phone } from 'lucide-react'
import { lazy, Suspense, useRef } from 'react'
import { fullAddress, hotel } from '../../config/hotel'
import { emailHref, phoneLinks, whatsappNumber } from '../../lib/contact'
import { useReveal } from '../animations/useReveal'
import { WhatsAppIcon } from '../ui/Icons'
import { Overline, SplitHeading } from '../ui/Typography'

const BookingForm = lazy(() => import('./BookingForm'))

function FormPlaceholder() {
  return <div className="min-h-[46rem] rounded-[4px] bg-beige/95 sm:min-h-[40rem]" aria-hidden />
}

export function Booking() {
  const scope = useRef<HTMLElement>(null)
  useReveal(scope)

  return (
    <section ref={scope} id="contact" aria-labelledby="contact-title" className="grain section-y relative bg-forest text-beige">
      <div className="shell grid gap-14 lg:grid-cols-12 lg:gap-12">
        <div className="lg:col-span-5">
          <div data-reveal="up">
            <Overline tone="light">Booking &amp; Contact</Overline>
          </div>
          <SplitHeading
            id="contact-title"
            className="text-h2 mt-6"
            lines={['Plan your stay', <em key="b" className="text-gold-light">with us.</em>]}
          />
          <p data-reveal="up" className="text-lead mt-7 max-w-md text-beige/80">
            Share your dates and we will get back to you with availability. No payment is taken on this website.
          </p>

          <ul data-reveal="items" className="mt-10 space-y-4">
            {whatsappNumber && (
              <li data-item>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 rounded-[3px] border border-beige/15 p-4 transition-colors hover:border-gold-light/60"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-beige/10 text-gold-light">
                    <WhatsAppIcon className="size-5" />
                  </span>
                  <span>
                    <span className="text-overline block text-gold-light">WhatsApp</span>
                    <span className="mt-0.5 block font-semibold">+{whatsappNumber}</span>
                  </span>
                </a>
              </li>
            )}
            {phoneLinks.map((phone) => (
              <li data-item key={phone.href}>
                <a
                  href={phone.href}
                  className="group flex items-center gap-4 rounded-[3px] border border-beige/15 p-4 transition-colors hover:border-gold-light/60"
                >
                  <span className="grid size-11 place-items-center rounded-full bg-beige/10 text-gold-light">
                    <Phone className="size-5" aria-hidden />
                  </span>
                  <span>
                    <span className="text-overline block text-gold-light">Call</span>
                    <span className="mt-0.5 block font-semibold">{phone.label}</span>
                  </span>
                </a>
              </li>
            ))}
            {emailHref && (
              <li data-item>
                <a
                  href={emailHref}
                  className="group flex items-center gap-4 rounded-[3px] border border-beige/15 p-4 transition-colors hover:border-gold-light/60"
                >
                  <span className="grid size-11 shrink-0 place-items-center rounded-full bg-beige/10 text-gold-light">
                    <Mail className="size-5" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="text-overline block text-gold-light">Email</span>
                    <span className="mt-0.5 block break-all font-semibold">{hotel.contact.email}</span>
                  </span>
                </a>
              </li>
            )}
            <li data-item className="flex gap-4 p-4 pl-0 text-sm leading-relaxed text-beige/70">
              <span className="text-overline shrink-0 pt-0.5 text-gold-light">Visit</span>
              {fullAddress}
            </li>
          </ul>
        </div>

        <div data-reveal="up" className="lg:col-span-7">
          <Suspense fallback={<FormPlaceholder />}>
            <BookingForm />
          </Suspense>
        </div>
      </div>
    </section>
  )
}
