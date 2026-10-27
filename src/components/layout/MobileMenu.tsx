import { AnimatePresence, motion } from 'motion/react'
import { MapPin, Phone } from 'lucide-react'
import { useEffect, type RefObject } from 'react'
import { fullAddress } from '../../config/hotel'
import { navItems } from '../../data/navigation'
import { phoneHref, whatsappNumber } from '../../lib/contact'
import { cn } from '../../lib/cn'
import { useEnquiry } from '../providers/contexts'
import { useScrollApi } from '../providers/contexts'
import { WhatsAppIcon } from '../ui/Icons'

interface MobileMenuProps {
  open: boolean
  onClose: () => void
  /** Header element containing both the toggle and the menu — the focus-trap boundary. */
  containerRef: RefObject<HTMLElement | null>
  active: string
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
const ease = [0.22, 1, 0.36, 1] as const

export function MobileMenu({ open, onClose, containerRef, active }: MobileMenuProps) {
  const { setLocked } = useScrollApi()
  const { enquireGeneral } = useEnquiry()

  // Scroll lock, Escape to close, focus trap, focus restore.
  useEffect(() => {
    if (!open) return
    const container = containerRef.current
    const toggle = container?.querySelector<HTMLButtonElement>('[aria-controls="mobile-menu"]')
    setLocked(true)

    const focusables = () =>
      Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter((el) => el.offsetParent !== null)
    const first = window.setTimeout(() => container?.querySelector<HTMLElement>('#mobile-menu a')?.focus(), 80)

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const items = focusables()
      if (!items.length) return
      const idx = items.indexOf(document.activeElement as HTMLElement)
      if (e.shiftKey && idx <= 0) {
        e.preventDefault()
        items[items.length - 1].focus()
      } else if (!e.shiftKey && idx === items.length - 1) {
        e.preventDefault()
        items[0].focus()
      }
    }
    const onResize = () => {
      if (window.innerWidth >= 1280) onClose()
    }
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onResize)
    return () => {
      window.clearTimeout(first)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onResize)
      setLocked(false)
      toggle?.focus({ preventScroll: true })
    }
  }, [open, onClose, containerRef, setLocked])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="grain fixed inset-0 flex flex-col overflow-y-auto bg-forest-night text-beige xl:hidden"
          initial={{ clipPath: 'inset(0% 0% 100% 0%)' }}
          animate={{ clipPath: 'inset(0% 0% 0% 0%)' }}
          exit={{ clipPath: 'inset(0% 0% 100% 0%)', transition: { duration: 0.5, ease, delay: 0.1 } }}
          transition={{ duration: 0.7, ease }}
        >
          <div className="shell flex min-h-full flex-1 flex-col pb-[max(2rem,env(safe-area-inset-bottom))] pt-28">
            <nav aria-label="Mobile">
              <ul className="flex flex-col">
                {navItems.map((item, i) => (
                  <li key={item.id} className="line-mask border-b border-beige/10">
                    <motion.a
                      href={`#${item.id}`}
                      onClick={onClose}
                      aria-current={active === item.id ? 'true' : undefined}
                      className={cn(
                        'flex min-h-14 items-baseline gap-4 py-2 font-serif text-[clamp(2rem,8vw,3.25rem)] leading-tight transition-colors',
                        active === item.id ? 'text-gold-light' : 'hover:text-gold-light',
                      )}
                      initial={{ y: '110%' }}
                      animate={{ y: '0%' }}
                      exit={{ y: '110%', transition: { duration: 0.25, delay: 0 } }}
                      transition={{ duration: 0.75, ease, delay: 0.18 + i * 0.045 }}
                    >
                      <span className="text-overline w-6 font-sans text-gold-light/70">{String(i + 1).padStart(2, '0')}</span>
                      {item.label}
                    </motion.a>
                  </li>
                ))}
              </ul>
            </nav>

            <motion.div
              className="mt-auto flex flex-col gap-6 pt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, transition: { duration: 0.2, delay: 0 } }}
              transition={{ duration: 0.6, ease, delay: 0.55 }}
            >
              <div className="flex flex-wrap gap-3">
                <a
                  href="#contact"
                  onClick={onClose}
                  className="inline-flex min-h-12 items-center rounded-full bg-gold px-6 text-[0.75rem] font-bold uppercase tracking-[0.18em] text-forest-night"
                >
                  Book / Enquire Now
                </a>
                {whatsappNumber && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose()
                      enquireGeneral()
                    }}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-beige/30 px-5 text-[0.75rem] font-bold uppercase tracking-[0.18em]"
                  >
                    <WhatsAppIcon className="size-4" /> WhatsApp
                  </button>
                )}
                {phoneHref && (
                  <a
                    href={phoneHref}
                    className="inline-flex min-h-12 items-center gap-2 rounded-full border border-beige/30 px-5 text-[0.75rem] font-bold uppercase tracking-[0.18em]"
                  >
                    <Phone className="size-4" aria-hidden /> Call
                  </a>
                )}
              </div>
              <p className="flex max-w-sm gap-3 text-sm leading-relaxed text-beige/70">
                <MapPin className="mt-0.5 size-4 shrink-0 text-gold-light" aria-hidden />
                {fullAddress}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
