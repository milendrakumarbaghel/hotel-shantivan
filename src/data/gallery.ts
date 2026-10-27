import { getImage, getVideo, type ImageId, type VideoId } from '../config/media'

export type GalleryFilter = 'all' | 'rooms' | 'interiors' | 'dining' | 'outside'

/** Tile shape in the editorial grid. Photos are portrait; tiles crop them creatively. */
export type GallerySpan = 'feature' | 'tall' | 'square' | 'wide'

export type GalleryItem =
  | { kind: 'image'; id: ImageId; group: Exclude<GalleryFilter, 'all'>; span: GallerySpan; focus?: string }
  | { kind: 'video'; id: VideoId; group: Exclude<GalleryFilter, 'all'>; span: GallerySpan; focus?: string }

export const galleryFilters: { id: GalleryFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'interiors', label: 'Interiors' },
  { id: 'dining', label: 'Dining' },
  { id: 'outside', label: 'Outside' },
]

/** Order matters — it is tuned for a balanced composition at every breakpoint. */
export const galleryItems: GalleryItem[] = [
  { kind: 'image', id: 'exterior-entrance-day', group: 'outside', span: 'feature', focus: '50% 60%' },
  { kind: 'image', id: 'room-mist', group: 'rooms', span: 'tall' },
  { kind: 'image', id: 'garden-lights-night', group: 'outside', span: 'tall' },
  { kind: 'image', id: 'dining-ceiling-still', group: 'dining', span: 'square', focus: '50% 45%' },
  { kind: 'image', id: 'room-coral', group: 'rooms', span: 'wide', focus: '50% 62%' },
  { kind: 'video', id: 'corridor-warm', group: 'interiors', span: 'tall' },
  { kind: 'image', id: 'room-blush', group: 'rooms', span: 'tall' },
  { kind: 'image', id: 'dining-hall-still', group: 'dining', span: 'square', focus: '50% 70%' },
  { kind: 'image', id: 'exterior-signage-night', group: 'outside', span: 'tall' },
  { kind: 'image', id: 'corridor-symmetry-still', group: 'interiors', span: 'feature', focus: '50% 55%' },
  { kind: 'video', id: 'room-coral-detail', group: 'rooms', span: 'square' },
  { kind: 'image', id: 'room-azure', group: 'rooms', span: 'tall' },
  { kind: 'image', id: 'entrance-welcome-still', group: 'outside', span: 'wide', focus: '50% 55%' },
  { kind: 'video', id: 'bed-linen-detail', group: 'rooms', span: 'square' },
  { kind: 'video', id: 'room-azure-walkthrough', group: 'rooms', span: 'tall' },
  { kind: 'video', id: 'corridor-arches', group: 'interiors', span: 'tall' },
]

/** Resolved media (alt text, caption, files) for a gallery entry. */
export function galleryItemMedia(item: GalleryItem) {
  return item.kind === 'image' ? getImage(item.id) : getVideo(item.id)
}
