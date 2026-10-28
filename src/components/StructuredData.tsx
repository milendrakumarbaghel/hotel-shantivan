import { hotel } from '../config/hotel'
import { asset } from '../config/media'

/**
 * schema.org Hotel data built ONLY from verified configuration.
 * No rating, price range or amenity claims are emitted until the owner confirms them.
 */
export function StructuredData() {
  const origin = hotel.siteUrl ?? ''
  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Hotel',
    name: hotel.name,
    description: hotel.seoDescription,
    address: {
      '@type': 'PostalAddress',
      streetAddress: hotel.address.line1,
      addressLocality: `${hotel.address.locality}, ${hotel.address.city}`,
      addressRegion: hotel.address.state,
      postalCode: hotel.address.postalCode,
      addressCountry: hotel.address.countryCode,
    },
    image: [`${origin}${asset('/og-image.jpg')}`, `${origin}${asset('/assets/images/exterior-entrance-day.jpg')}`],
  }
  if (hotel.siteUrl) data.url = hotel.siteUrl
  if (hotel.contact.phones.length) data.telephone = hotel.contact.phones
  if (hotel.contact.email) data.email = hotel.contact.email
  if (hotel.map.coordinates) {
    data.geo = { '@type': 'GeoCoordinates', latitude: hotel.map.coordinates.lat, longitude: hotel.map.coordinates.lng }
  }
  if (hotel.map.placeUrl) data.hasMap = hotel.map.placeUrl
  // Ratings/reviews are intentionally omitted: self-published review markup is not eligible
  // for rich results, and nothing should be emitted that the owner has not verified.

  return (
    <script
      type="application/ld+json"
      // JSON.stringify output is safe here; escape "<" so the payload can never close the script tag.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
