import type { ImageId, VideoId } from '../config/media'

/**
 * Rooms shown in the "Rooms & Accommodation" section.
 *
 * The owner has not yet confirmed room categories, occupancy or tariffs, so:
 *  - `name` is null → the card falls back to `descriptor`, a plain description of
 *    the photographed interior (not an official room category).
 *  - `occupancy` / `price` are null → they are simply not displayed.
 *  - `features` only list what is visible in the owner's own photographs.
 *
 * To publish confirmed details, fill in `name`, `occupancy` and/or `price`.
 * The booking form's room options live in `roomPreferences` below, not in this list.
 */
export interface Room {
  id: string
  /** Official room category, e.g. 'Deluxe Double Room'. null until confirmed. */
  name: string | null
  /** Descriptive title used while `name` is not confirmed. */
  descriptor: string
  description: string
  image: ImageId
  /** Optional short clip that plays on hover / when in view. */
  video?: VideoId
  features: string[]
  occupancy: string | null
  /** e.g. '₹2,500 / night'. Only set when verified by the owner. */
  price: string | null
}

export const rooms: Room[] = [
  {
    id: 'coral',
    name: null,
    descriptor: 'Coral & Indigo',
    description:
      'Warm coral walls meet a striking deep-blue marble floor. A generous double bed, full-length mirror and a small table by the window.',
    image: 'room-coral',
    video: 'room-coral-detail',
    features: ['Double bed', 'Full-length mirror', 'Table & chairs', 'Ceiling fan'],
    occupancy: null,
    price: null,
  },
  {
    id: 'blush',
    name: null,
    descriptor: 'Blush & Bronze',
    description:
      'Soft blush tones, warm wood and a maroon-and-gold runner. Bright, airy and calm, with a window dressed in heavy grey drapes.',
    image: 'room-blush',
    features: ['Double bed', 'Split air-conditioner', 'Table & chairs', 'Bedside table'],
    occupancy: null,
    price: null,
  },
  {
    id: 'mist',
    name: null,
    descriptor: 'Mist & Marble',
    description:
      'Pale grey-blue walls, white veined marble underfoot and sculptural red chairs — a light, modern room with a layered ceiling.',
    image: 'room-mist',
    video: 'bed-linen-detail',
    features: ['Double bed', 'Split air-conditioner', 'Seating chairs', 'Marble flooring'],
    occupancy: null,
    price: null,
  },
  {
    id: 'azure',
    name: null,
    descriptor: 'Azure & Light',
    description:
      'Sky-blue walls and a wide window that fills the room with daylight. A spacious layout with a double bed and seating corner.',
    image: 'room-azure',
    video: 'room-azure-walkthrough',
    features: ['Double bed', 'Large window', 'Table & chairs', 'Marble flooring'],
    occupancy: null,
    price: null,
  },
]

export const roomTitle = (room: Room) => room.name ?? room.descriptor

/** Options of the booking form's "Preferred room" dropdown (sent in the enquiry message). */
export const roomPreferences = ['AC Room', 'Non-AC Room'] as const
