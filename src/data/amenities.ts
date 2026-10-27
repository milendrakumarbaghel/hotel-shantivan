/**
 * Facilities & amenities.
 *
 * `status` records where each item comes from:
 *  - 'confirmed' → stated by the owner / project brief.
 *  - 'observed'  → clearly visible in the owner-supplied photographs and videos,
 *                  but still awaiting written confirmation from the owner.
 *
 * Set SHOW_OBSERVED_AMENITIES to false to publish confirmed items only.
 * Never add services (Wi-Fi, room service, pool…) that have not been confirmed.
 */
export type AmenityIcon = 'snowflake' | 'utensils' | 'trees' | 'bed' | 'sparkles' | 'plane'

export interface Amenity {
  id: string
  title: string
  description: string
  icon: AmenityIcon
  status: 'confirmed' | 'observed'
}

export const SHOW_OBSERVED_AMENITIES = true

export const amenities: Amenity[] = [
  {
    id: 'location',
    title: 'Opposite Suktara Airport',
    description: 'Easy to find on Badalpar Road, close to Seoni city.',
    icon: 'plane',
    status: 'confirmed',
  },
  {
    id: 'rooms',
    title: 'Spacious Double Rooms',
    description: 'Generous rooms with double beds, crisp white linen and fresh towels.',
    icon: 'bed',
    status: 'observed',
  },
  {
    id: 'ac',
    title: 'Air-Conditioning',
    description: 'Wall-mounted split air-conditioners in the rooms.',
    icon: 'snowflake',
    status: 'observed',
  },
  {
    id: 'dining',
    title: 'Dining Hall',
    description: 'A bright in-house dining hall beneath a glowing moon ceiling.',
    icon: 'utensils',
    status: 'observed',
  },
  {
    id: 'garden',
    title: 'Garden Seating',
    description: 'Open-air tables under a great tree and a canopy of warm lights.',
    icon: 'trees',
    status: 'observed',
  },
  {
    id: 'interiors',
    title: 'Marble Interiors',
    description: 'Polished marble floors and light-filled arched corridors.',
    icon: 'sparkles',
    status: 'observed',
  },
]

export const visibleAmenities = amenities.filter(
  (a) => a.status === 'confirmed' || SHOW_OBSERVED_AMENITIES,
)
