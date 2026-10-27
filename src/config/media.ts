/**
 * Media manifest — every photograph and video used on the site.
 *
 * Files are produced by `npm run media` from the originals in media/originals
 * (see media/media-sources.json). Dimensions and blur placeholders come from the
 * auto-generated media.generated.ts; descriptive data (alt text, captions,
 * categories) is curated here.
 */
import { imageMeta, videoMeta, type ImageId, type VideoId } from './media.generated'

export type { ImageId, VideoId }

export type MediaCategory =
  | 'exterior'
  | 'entrance'
  | 'rooms'
  | 'interiors'
  | 'common-areas'
  | 'facilities'
  | 'outdoor'

interface MediaCopy {
  alt: string
  caption: string
  category: MediaCategory
}

export interface ImageAsset extends MediaCopy {
  id: ImageId
  src: string
  width: number
  height: number
  widths: readonly number[]
  lqip: string
}

export interface VideoAsset extends MediaCopy {
  id: VideoId
  src: string
  poster: string
  posterFallback: string
  width: number
  height: number
}

const base = import.meta.env.BASE_URL.replace(/\/$/, '')
export const asset = (path: string) => `${base}${path}`

const imageCopy: Record<ImageId, MediaCopy> = {
  'exterior-entrance-day': {
    alt: 'Front entrance of the hotel at golden hour — brick-clad pillars, a balustraded roofline and an arched “Welcome” doorway',
    caption: 'The front entrance, at golden hour',
    category: 'entrance',
  },
  'room-coral': {
    alt: 'Guest room with coral walls, a double bed with white linen and green cushions, a full-length mirror and a deep-blue marble floor',
    caption: 'Coral walls and deep-blue marble',
    category: 'rooms',
  },
  'room-blush': {
    alt: 'Guest room with soft pink walls, a double bed with maroon-and-gold runner, a split air-conditioner and a window with grey curtains',
    caption: 'Soft blush tones and warm wood',
    category: 'rooms',
  },
  'garden-lights-night': {
    alt: 'Open-air garden seating at night — yellow chairs and tables beneath a canopy of warm string lights and a large tree',
    caption: 'Garden seating beneath the string lights',
    category: 'outdoor',
  },
  'exterior-signage-night': {
    alt: 'The illuminated hotel sign and arched welcome doorway at night, framed by strings of warm lights',
    caption: 'Evenings at the entrance',
    category: 'exterior',
  },
  'room-mist': {
    alt: 'Bright guest room with pale grey-blue walls, a double bed, two red sculptural chairs and white marble flooring',
    caption: 'Pale mist walls and white marble',
    category: 'rooms',
  },
  'room-azure': {
    alt: 'Spacious room with sky-blue walls, a double bed with a patterned runner, red chairs and a large window',
    caption: 'Sky-blue walls and a wide window',
    category: 'rooms',
  },
  'dining-hall-still': {
    alt: 'Dining hall with chequered tablecloths, colourful chairs, large windows and a circular illuminated ceiling',
    caption: 'The dining hall',
    category: 'common-areas',
  },
  'corridor-symmetry-still': {
    alt: 'Long corridor with arched windows, polished marble floor and a round-topped window at the far end',
    caption: 'Arched corridors, polished marble',
    category: 'interiors',
  },
  'entrance-welcome-still': {
    alt: 'Looking through the arched welcome doorway into the bright dining area',
    caption: 'Through the welcome arch',
    category: 'entrance',
  },
  'dining-ceiling-still': {
    alt: 'Circular false ceiling in the dining hall, lit in blue with a moon-like design and a warm golden rim',
    caption: 'The moon ceiling in the dining hall',
    category: 'common-areas',
  },
}

const videoCopy: Record<VideoId, MediaCopy> = {
  'corridor-arches': {
    alt: 'Walking slowly down a bright corridor lined with arched windows',
    caption: 'A walk down the arched corridor',
    category: 'interiors',
  },
  'room-azure-walkthrough': {
    alt: 'Stepping through a doorway into a sky-blue guest room with a double bed',
    caption: 'Stepping into a sky-blue room',
    category: 'rooms',
  },
  'entrance-welcome': {
    alt: 'Approaching the hotel sign and walking through the welcome arch into the dining area',
    caption: 'Arriving through the welcome arch',
    category: 'entrance',
  },
  'dining-hall': {
    alt: 'Panning across the dining hall with its tables, chairs and glowing ceiling',
    caption: 'The dining hall',
    category: 'common-areas',
  },
  'dining-ceiling': {
    alt: 'The illuminated moon ceiling above the dining hall',
    caption: 'The moon ceiling',
    category: 'common-areas',
  },
  'corridor-warm': {
    alt: 'A corridor in warm light with wooden doors and arched windows',
    caption: 'Corridor in warm evening light',
    category: 'interiors',
  },
  'corridor-symmetry': {
    alt: 'A symmetrical corridor with arched windows on both sides',
    caption: 'Symmetry and light',
    category: 'interiors',
  },
  'room-coral-detail': {
    alt: 'Close view of a made-up double bed with folded towels in the coral room',
    caption: 'Fresh linen, folded towels',
    category: 'rooms',
  },
  'bed-linen-detail': {
    alt: 'Close view of crisp white bed linen and patterned cushions',
    caption: 'Crisp white linen',
    category: 'rooms',
  },
}

export function getImage(id: ImageId): ImageAsset {
  const meta = imageMeta[id]
  return {
    id,
    ...imageCopy[id],
    src: asset(`/assets/images/${id}.jpg`),
    width: meta.width,
    height: meta.height,
    widths: meta.widths,
    lqip: meta.lqip,
  }
}

export function getVideo(id: VideoId): VideoAsset {
  const meta = videoMeta[id]
  return {
    id,
    ...videoCopy[id],
    src: asset(`/assets/videos/${id}.mp4`),
    poster: asset(`/assets/posters/${id}.webp`),
    posterFallback: asset(`/assets/posters/${id}.jpg`),
    width: meta.width,
    height: meta.height,
  }
}

export type ImageFormat = 'avif' | 'webp' | 'jpg'

export function srcSetFor(image: ImageAsset, format: ImageFormat) {
  return image.widths.map((w) => `${asset(`/assets/optimized/${image.id}-${w}.${format}`)} ${w}w`).join(', ')
}

/** Curated picks for each part of the page. */
export const featured = {
  heroVideo: 'corridor-arches',
  heroAccent: 'garden-lights-night',
  aboutPrimary: 'exterior-entrance-day',
  aboutSecondary: 'garden-lights-night',
  immersiveVideo: 'room-azure-walkthrough',
  locationImage: 'exterior-signage-night',
  bookingImage: 'entrance-welcome-still',
} as const satisfies Record<string, ImageId | VideoId>
