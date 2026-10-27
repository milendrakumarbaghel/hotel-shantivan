import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { whatsappNumber } from '../../lib/contact'
import { useEnquiry } from '../providers/contexts'
import { WhatsAppIcon } from '../ui/Icons'

/** Appears after the hero; respects the iOS/Android safe area. Hidden until a number is configured. */
export function FloatingWhatsApp() {
  const { enquireGeneral } = useEnquiry()
  const reducedMotion = usePrefersReducedMotion()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!whatsappNumber) return
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  if (!whatsappNumber) return null

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={enquireGeneral}
          aria-label="Enquire on WhatsApp"
          className="group fixed z-40 flex size-14 items-center justify-center rounded-full bg-[#1f7a4d] text-white shadow-[0_18px_40px_-12px_rgba(19,40,28,0.6)] transition-colors hover:bg-[#19683f] sm:size-16"
          style={{
            right: 'max(1rem, env(safe-area-inset-right))',
            bottom: 'max(1rem, env(safe-area-inset-bottom))',
          }}
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          whileHover={reducedMotion ? undefined : { scale: 1.06 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        >
          <WhatsAppIcon className="size-7" />
          <span className="pointer-events-none absolute right-full mr-3 hidden whitespace-nowrap rounded-full bg-forest-night px-4 py-2 text-[0.72rem] font-semibold tracking-wide text-beige opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:block">
            Enquire on WhatsApp
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
