import { describe, expect, it } from 'vitest'
import { createBookingSchema, type BookingFormValues } from './booking'
import { buildBookingMessage, buildRoomEnquiryMessage } from './messages'
import { nightsBetween, parseLocalDate } from './dates'
import { roomPreferences } from '../data/rooms'

const TODAY = '2026-11-01'
const schema = createBookingSchema(TODAY)

const valid: BookingFormValues = {
  name: 'Asha Verma',
  phone: '+91 98765 43210',
  checkIn: '2026-11-10',
  checkOut: '2026-11-12',
  guests: 2,
  room: '',
  message: '',
}

const errorsFor = (values: Partial<BookingFormValues>) => {
  const result = schema.safeParse({ ...valid, ...values })
  return result.success ? {} : Object.fromEntries(result.error.issues.map((i) => [i.path.join('.'), i.message]))
}

describe('booking schema', () => {
  it('accepts a complete, valid enquiry', () => {
    expect(schema.safeParse(valid).success).toBe(true)
  })

  it('requires name, phone and dates', () => {
    const errors = errorsFor({ name: '', phone: '', checkIn: '', checkOut: '' })
    expect(Object.keys(errors)).toEqual(expect.arrayContaining(['name', 'phone', 'checkIn', 'checkOut']))
  })

  it.each([
    ['98765 43210', true],
    ['+91-98765-43210', true],
    ['(0755) 123 4567', true],
    ['12345', false],
    ['98765abc10', false],
    ['+1 234 567 890 123 456', false],
  ])('phone %s → valid: %s', (phone, ok) => {
    expect('phone' in errorsFor({ phone })).toBe(!ok)
  })

  it('rejects a check-in date in the past', () => {
    expect(errorsFor({ checkIn: '2026-10-31' }).checkIn).toMatch(/past/)
  })

  it('rejects impossible calendar dates', () => {
    expect(errorsFor({ checkIn: '2026-02-31' }).checkIn).toBeDefined()
  })

  it('requires check-out to be after check-in', () => {
    expect(errorsFor({ checkOut: '2026-11-10' }).checkOut).toMatch(/after check-in/)
    expect(errorsFor({ checkOut: '2026-11-09' }).checkOut).toMatch(/after check-in/)
  })

  it('validates the date order even while other fields are invalid', () => {
    expect(errorsFor({ name: '', checkOut: '2026-11-09' }).checkOut).toMatch(/after check-in/)
  })

  it.each([
    [0, false],
    [1, true],
    [20, true],
    [21, false],
    [2.5, false],
    [Number.NaN, false],
  ])('guests %s → valid: %s', (guests, ok) => {
    expect('guests' in errorsFor({ guests })).toBe(!ok)
  })
})

describe('room preference', () => {
  it('offers exactly AC Room and Non-AC Room', () => {
    expect(roomPreferences).toEqual(['AC Room', 'Non-AC Room'])
  })

  it.each(['', undefined, ...roomPreferences])('room %s → valid', (room) => {
    expect('room' in errorsFor({ room })).toBe(false)
  })
})

describe('WhatsApp messages', () => {
  it('formats a booking enquiry with all details and never claims confirmation', () => {
    const message = buildBookingMessage({ ...valid, room: 'Non-AC Room', message: 'Arriving late evening' })
    expect(message).toContain('Hello Hotel Shantione,')
    expect(message).toContain('Guest Name: Asha Verma')
    expect(message).toContain('Phone: +91 98765 43210')
    expect(message).toMatch(/Check-in: .*10 Nov 2026/)
    expect(message).toMatch(/Check-out: .*12 Nov 2026 \(2 nights\)/)
    expect(message).toContain('Guests: 2')
    expect(message).toContain('Preferred Room: Non-AC Room')
    expect(message).toContain('Additional Message: Arriving late evening')
    expect(message.trim().endsWith('Please let me know the availability.')).toBe(true)
    expect(message.toLowerCase()).not.toContain('confirmed')
  })

  it('omits optional lines when they are empty', () => {
    const message = buildBookingMessage(valid)
    expect(message).not.toContain('Preferred Room')
    expect(message).not.toContain('Additional Message')
  })

  it('survives URL encoding round-trip', () => {
    const message = buildBookingMessage({ ...valid, message: 'Room with A/C & early check-in? 100%' })
    expect(decodeURIComponent(encodeURIComponent(message))).toBe(message)
  })

  it('identifies the selected room', () => {
    expect(buildRoomEnquiryMessage('Coral & Indigo')).toContain('"Coral & Indigo"')
  })
})

describe('dates', () => {
  it('parses local calendar dates without timezone drift', () => {
    const d = parseLocalDate('2026-11-10')!
    expect([d.getFullYear(), d.getMonth(), d.getDate()]).toEqual([2026, 10, 10])
  })

  it('counts nights', () => {
    expect(nightsBetween('2026-11-10', '2026-11-13')).toBe(3)
  })
})
