import { z } from 'zod'
import { parseLocalDate, todayISO } from './dates'

export const MAX_GUESTS = 20

/** Accepts common Indian & international formats: +91 98765 43210, 098765-43210, (0755) 123 4567 … */
const PHONE_PATTERN = /^\+?[\d\s\-()]{7,20}$/

export function createBookingSchema(today: string = todayISO()) {
  return z
    .object({
      name: z.string().trim().min(2, 'Please enter your full name.').max(80, 'Name is too long.'),
      phone: z
        .string()
        .trim()
        .min(1, 'Please enter a phone number.')
        .refine((v) => PHONE_PATTERN.test(v), 'Use digits, spaces, dashes or a leading +.')
        .refine((v) => {
          const digits = v.replace(/\D/g, '').length
          return digits >= 10 && digits <= 15
        }, 'Phone number should have 10–15 digits.'),
      checkIn: z
        .string()
        .min(1, 'Please choose a check-in date.')
        .refine((v) => parseLocalDate(v) !== null, 'Please choose a valid date.')
        .refine((v) => v >= today, 'Check-in cannot be in the past.'),
      checkOut: z
        .string()
        .min(1, 'Please choose a check-out date.')
        .refine((v) => parseLocalDate(v) !== null, 'Please choose a valid date.'),
      guests: z
        .number({ error: 'Please enter the number of guests.' })
        .int('Guests must be a whole number.')
        .min(1, 'At least 1 guest.')
        .max(MAX_GUESTS, `For groups larger than ${MAX_GUESTS}, please mention it in your message.`),
      room: z.string().optional(),
      message: z.string().trim().max(600, 'Please keep your message under 600 characters.').optional(),
    })
    .refine((data) => data.checkOut > data.checkIn, {
      path: ['checkOut'],
      message: 'Check-out must be after check-in.',
      // Run the cross-field check as soon as both dates are valid, even if other fields are not.
      when(payload) {
        const value = payload.value as { checkIn?: unknown; checkOut?: unknown }
        return (
          typeof value.checkIn === 'string' &&
          typeof value.checkOut === 'string' &&
          parseLocalDate(value.checkIn) !== null &&
          parseLocalDate(value.checkOut) !== null
        )
      },
    })
}

export type BookingFormValues = z.infer<ReturnType<typeof createBookingSchema>>
