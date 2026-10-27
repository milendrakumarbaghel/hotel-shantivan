import { describe, expect, it, vi } from 'vitest'

describe('contact helpers', () => {
  it('returns no WhatsApp/phone links while numbers are unconfigured', async () => {
    vi.resetModules()
    vi.doMock('../config/hotel', async (orig) => {
      const mod = await orig<typeof import('../config/hotel')>()
      return { ...mod, hotel: { ...mod.hotel, contact: { phone: '', whatsapp: '', email: '' } } }
    })
    const { whatsappUrl, phoneHref } = await import('./contact')
    expect(whatsappUrl('hi')).toBeNull()
    expect(phoneHref).toBeNull()
    vi.doUnmock('../config/hotel')
  })

  it('builds encoded wa.me and tel links from configured numbers', async () => {
    vi.resetModules()
    vi.doMock('../config/hotel', async (orig) => {
      const mod = await orig<typeof import('../config/hotel')>()
      return { ...mod, hotel: { ...mod.hotel, contact: { phone: '+91 98765 43210', whatsapp: '+91 98765-43210', email: '' } } }
    })
    const { whatsappUrl, phoneHref } = await import('./contact')
    expect(whatsappUrl('Hello & welcome\nLine 2')).toBe('https://wa.me/919876543210?text=Hello%20%26%20welcome%0ALine%202')
    expect(phoneHref).toBe('tel:+919876543210')
    vi.doUnmock('../config/hotel')
  })

  it('falls back to the airport landmark for directions when no pin is verified', async () => {
    vi.resetModules()
    const { directionsUrl, directionsUseLandmark } = await import('./contact')
    expect(directionsUseLandmark).toBe(true)
    expect(directionsUrl()).toContain('destination=Suktara%20Airport')
  })
})
