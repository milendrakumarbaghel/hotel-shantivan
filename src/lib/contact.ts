import { hotel } from '../config/hotel'

const digitsOnly = (value: string) => value.replace(/\D/g, '')

/** WhatsApp number in wa.me format, or null when the owner has not configured one. */
export const whatsappNumber: string | null = digitsOnly(hotel.contact.whatsapp) || null

/** tel: href, or null when no phone number is configured. */
export const phoneHref: string | null = hotel.contact.phone
  ? `tel:${hotel.contact.phone.replace(/[^\d+]/g, '')}`
  : null

export function whatsappUrl(message: string): string | null {
  if (!whatsappNumber) return null
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
}

/**
 * Best available Google Maps directions link. Priority:
 * verified listing link → verified coordinates → landmark (Suktara Airport).
 */
export function directionsUrl(): string {
  if (hotel.map.placeUrl) return hotel.map.placeUrl
  const destination = hotel.map.coordinates
    ? `${hotel.map.coordinates.lat},${hotel.map.coordinates.lng}`
    : hotel.map.fallbackDestination
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`
}

/** True when directions lead to the landmark rather than a verified hotel pin. */
export const directionsUseLandmark = !hotel.map.placeUrl && !hotel.map.coordinates

export function openExternal(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer')
}
