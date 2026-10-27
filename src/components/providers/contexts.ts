import { createContext, useContext } from 'react'

export interface ScrollApi {
  /** Smoothly scrolls to a section id (without '#') and moves keyboard focus there. */
  scrollToId: (id: string) => void
  /** Locks / unlocks page scrolling (used by the mobile menu and lightbox). */
  setLocked: (locked: boolean) => void
}

export interface EnquiryApi {
  /** Room label pre-selected in the booking form (set by room cards). */
  preferredRoom: string
  setPreferredRoom: (label: string) => void
  /** Opens WhatsApp for a room — or, if WhatsApp isn't configured, pre-fills the form. */
  enquireRoom: (label: string) => void
  /** General enquiry: WhatsApp when configured, otherwise the booking form. */
  enquireGeneral: () => void
}

export const ScrollContext = createContext<ScrollApi | null>(null)
export const EnquiryContext = createContext<EnquiryApi | null>(null)

export function useScrollApi() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScrollApi must be used inside <SmoothScroll>')
  return ctx
}

export function useEnquiry() {
  const ctx = useContext(EnquiryContext)
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>')
  return ctx
}
