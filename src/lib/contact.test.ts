import { describe, expect, it, vi } from 'vitest'

type HotelModule = typeof import('../config/hotel')

/** Re-imports ./contact with parts of the hotel config overridden. */
async function contactWith(override: (hotel: HotelModule['hotel']) => Partial<HotelModule['hotel']>) {
  vi.resetModules()
  vi.doMock('../config/hotel', async (orig) => {
    const mod = await orig<HotelModule>()
    return { ...mod, hotel: { ...mod.hotel, ...override(mod.hotel) } }
  })
  const contact = await import('./contact')
  vi.doUnmock('../config/hotel')
  return contact
}

describe('contact helpers', () => {
  it('returns no WhatsApp/phone/email links while contact details are unconfigured', async () => {
    const { whatsappUrl, phoneHref, phoneLinks, emailHref } = await contactWith(() => ({
      contact: { phones: [], whatsapp: '', email: '' },
    }))
    expect(whatsappUrl('hi')).toBeNull()
    expect(phoneHref).toBeNull()
    expect(phoneLinks).toEqual([])
    expect(emailHref).toBeNull()
  })

  it('builds encoded wa.me and tel links from configured numbers', async () => {
    const { whatsappUrl, phoneHref } = await contactWith(() => ({
      contact: { phones: ['+91 98765 43210'], whatsapp: '+91 98765-43210', email: '' },
    }))
    expect(whatsappUrl('Hello & welcome\nLine 2')).toBe('https://wa.me/919876543210?text=Hello%20%26%20welcome%0ALine%202')
    expect(phoneHref).toBe('tel:+919876543210')
  })

  it('links both hotel phone numbers and the email address', async () => {
    vi.resetModules()
    const { phoneLinks, phoneHref, emailHref } = await import('./contact')
    expect(phoneLinks.map((p) => p.href)).toEqual(['tel:+917999384893', 'tel:+917000045162'])
    expect(phoneHref).toBe('tel:+917999384893')
    expect(emailHref).toBe('mailto:Shantione8@gmail.com')
  })

  it('uses the verified Google Maps link for directions', async () => {
    vi.resetModules()
    const { directionsUrl, directionsUseLandmark } = await import('./contact')
    expect(directionsUseLandmark).toBe(false)
    expect(directionsUrl()).toBe('https://maps.app.goo.gl/pdMDffmvqNE3yqKM8')
  })

  it('falls back to the airport landmark for directions when no pin is verified', async () => {
    const { directionsUrl, directionsUseLandmark } = await contactWith((hotel) => ({
      map: { ...hotel.map, placeUrl: null, coordinates: null },
    }))
    expect(directionsUseLandmark).toBe(true)
    expect(directionsUrl()).toContain('destination=Suktara%20Airport')
  })
})
