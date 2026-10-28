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
export type AmenityIcon = 'air-vent' | 'utensils' | 'trees'

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
    id: 'ac',
    title: 'Air Conditioner',
    description: 'Air-conditioned rooms with wall-mounted split units.',
    icon: 'air-vent',
    status: 'confirmed',
  },
  {
    id: 'dining',
    title: 'Dining Hall',
    description: 'A bright in-house dining hall beneath a glowing moon ceiling.',
    icon: 'utensils',
    status: 'confirmed',
  },
  {
    id: 'garden',
    title: 'Garden',
    description: 'Open-air tables under a great tree and a canopy of warm lights.',
    icon: 'trees',
    status: 'confirmed',
  },
]

export const visibleAmenities = amenities.filter(
  (a) => a.status === 'confirmed' || SHOW_OBSERVED_AMENITIES,
)
