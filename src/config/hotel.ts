/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  HOTEL SHANTIONE — CENTRAL BUSINESS CONFIGURATION
 * ─────────────────────────────────────────────────────────────────────────────
 *  Everything a non-developer may need to change lives here.
 *  Values left as `null` / '' are NOT yet confirmed by the owner — the website
 *  hides or gracefully adapts the related UI until they are filled in.
 *
 *  This file is also read by vite.config.ts at build time (SEO tags, sitemap),
 *  so keep it free of browser-only code and imports.
 */

export interface HotelConfig {
  name: string
  shortName: string
  tagline: string
  /** Used for <meta name="description"> and social cards. */
  seoDescription: string
  address: {
    line1: string
    locality: string
    city: string
    state: string
    postalCode: string
    country: string
    countryCode: string
  }
  landmark: string
  nearby: string[]
  contact: {
    /** Click-to-call numbers shown to guests, primary first, e.g. ['+91 98765 43210']. */
    phones: string[]
    /** WhatsApp number in international format, digits only, e.g. '919876543210'. */
    whatsapp: string
    email: string
  }
  map: {
    /** Verified hotel pin. Leave null until confirmed — never guess. */
    coordinates: { lat: number; lng: number } | null
    /** Google Maps link to the verified hotel listing (preferred for directions). */
    placeUrl: string | null
    /** Google Maps "Embed a map" iframe src, shown only when set. */
    embedUrl: string | null
    /** Used for directions while no verified pin exists. */
    fallbackDestination: string
  }
  /** Google Business Profile "write a review" link, if available. */
  googleReviewUrl: string | null
  /** Production URL without trailing slash, e.g. 'https://www.hotelshantione.com'. */
  siteUrl: string | null
  developer: { name: string; url: string | null }
}

export const hotel: HotelConfig = {
  name: 'Hotel Shantione',
  shortName: 'Shantione',
  tagline: 'Where Comfort Meets Tranquility',
  seoDescription:
    'Hotel Shantione in Suktara, Seoni (Madhya Pradesh) — comfortable rooms, a calm garden and warm hospitality in front of Redbird Airport (Suktara Domestic Airport) on Badalpar Road, near Seoni city and the Pench National Park region.',
  address: {
    line1: 'In front of Redbird Airport, Badalpar Road',
    locality: 'Suktara',
    city: 'Seoni',
    state: 'Madhya Pradesh',
    postalCode: '480661',
    country: 'India',
    countryCode: 'IN',
  },
  landmark: 'Redbird Airport (Suktara Domestic Airport)',
  nearby: ['Seoni city', 'Pench National Park region'],
  contact: {
    phones: ['+91 79993 84893', '+91 70000 45162'],
    whatsapp: '917999384893',
    email: 'Shantione8@gmail.com',
  },
  map: {
    coordinates: null, // TODO(owner): confirm exact pin
    placeUrl: 'https://maps.app.goo.gl/pdMDffmvqNE3yqKM8',
    embedUrl: null,
    fallbackDestination: 'Suktara Airport, Badalpar Road, Seoni, Madhya Pradesh 480661',
  },
  googleReviewUrl: null,
  siteUrl: null, // TODO(owner): production domain
  developer: { name: 'ANICX Media', url: 'https://anicx-media.vercel.app/' },
}

/** Owner-facing notice shown wherever an enquiry is made. */
export const BOOKING_NOTICE =
  'Your booking will be confirmed only after Hotel Shantione verifies availability and confirms your reservation.'

export const fullAddress = [
  hotel.address.line1,
  `${hotel.address.locality}, ${hotel.address.city}`,
  `${hotel.address.state} – ${hotel.address.postalCode}`,
  hotel.address.country,
].join(', ')
