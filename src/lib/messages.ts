import { hotel } from '../config/hotel'
import { formatDisplayDate, nightsBetween } from './dates'

/** Validated booking details (see createBookingSchema in ./booking). Kept dependency-free for the main bundle. */
export interface BookingDetails {
  name: string
  phone: string
  checkIn: string
  checkOut: string
  guests: number
  room?: string
  message?: string
}

export function buildBookingMessage(values: BookingDetails): string {
  const nights = nightsBetween(values.checkIn, values.checkOut)
  const lines = [
    `Hello ${hotel.name},`,
    '',
    'I would like to enquire about room availability.',
    '',
    `Guest Name: ${values.name.trim()}`,
    `Phone: ${values.phone.trim()}`,
    `Check-in: ${formatDisplayDate(values.checkIn)}`,
    `Check-out: ${formatDisplayDate(values.checkOut)}${nights > 0 ? ` (${nights} night${nights === 1 ? '' : 's'})` : ''}`,
    `Guests: ${values.guests}`,
  ]
  if (values.room?.trim()) lines.push(`Preferred Room: ${values.room.trim()}`)
  if (values.message?.trim()) lines.push(`Additional Message: ${values.message.trim()}`)
  lines.push('', 'Please let me know the availability.')
  return lines.join('\n')
}

export function buildRoomEnquiryMessage(roomLabel: string): string {
  return [
    `Hello ${hotel.name},`,
    '',
    `I would like to enquire about the room shown as "${roomLabel}" on your website.`,
    '',
    'Could you please share availability and tariff details?',
    '',
    'Thank you.',
  ].join('\n')
}

export function buildGeneralEnquiryMessage(): string {
  return `Hello ${hotel.name},\n\nI would like to enquire about room availability. Could you please help?\n\nThank you.`
}
