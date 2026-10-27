export interface NavItem {
  id: string
  label: string
}

/** Section ids double as anchor targets (#about, #rooms …). */
export const navItems: NavItem[] = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'gallery', label: 'Gallery' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'reviews', label: 'Reviews' },
  { id: 'location', label: 'Location' },
  { id: 'contact', label: 'Contact' },
]
