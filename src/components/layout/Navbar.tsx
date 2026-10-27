import { motion } from 'motion/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { hotel } from '../../config/hotel'
import { navItems } from '../../data/navigation'
import { usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'
import { Monogram } from '../ui/Icons'
import { MobileMenu } from './MobileMenu'

function useScrollState() {
  const [state, setState] = useState({ scrolled: false, hidden: false })
  useEffect(() => {
    let lastY = window.scrollY
    let frame = 0
    const update = () => {
      frame = 0
      const y = window.scrollY
      const delta = y - lastY
      setState((prev) => {
        const scrolled = y > 24
        // Hide while scrolling down past the hero; reveal on any upward scroll.
        const hidden = y > window.innerHeight * 0.85 && delta > 4 ? true : delta < -4 ? false : prev.hidden
        return prev.scrolled === scrolled && prev.hidden === hidden ? prev : { scrolled, hidden }
      })
      lastY = y
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(frame)
    }
  }, [])
  return state
}

function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el))
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setActive(entry.target.id)
      },
      { rootMargin: '-45% 0px -50% 0px' },
    )
    sections.forEach((s) => observer.observe(s))
    return () => observer.disconnect()
  }, [])
  return active
}

export function Navbar() {
  const { scrolled, hidden } = useScrollState()
  const active = useActiveSection()
  const [menuOpen, setMenuOpen] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const headerRef = useRef<HTMLElement>(null)
  const closeMenu = useCallback(() => setMenuOpen(false), [])

  const solid = scrolled && !menuOpen
  const light = !solid // light text over the dark hero or open menu

  return (
    <header ref={headerRef} id="site-header" className="fixed inset-x-0 top-0 z-50">
      <motion.div
        initial={false}
        animate={{ y: hidden && !menuOpen ? '-110%' : '0%' }}
        transition={{ duration: reducedMotion ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          'relative z-10 transition-[background-color,box-shadow,color] duration-500 ease-silk',
          solid
            ? 'bg-beige/88 text-forest shadow-[0_1px_0_rgba(36,74,54,0.08)] backdrop-blur-lg supports-[not(backdrop-filter:blur(1px))]:bg-beige'
            : 'bg-transparent text-beige',
        )}
      >
        <nav
          aria-label="Primary"
          className={cn(
            'shell flex items-center justify-between gap-6 transition-[height] duration-500 ease-silk',
            solid ? 'h-[4.25rem]' : 'h-20 lg:h-24',
          )}
        >
          <a href="#home" className="group flex items-center gap-3">
            <Monogram className={cn('h-9 w-auto transition-colors', light ? 'text-gold-light' : 'text-gold-deep')} />
            <span className="flex flex-col leading-none">
              <span className="text-[0.56rem] font-bold uppercase tracking-[0.42em] opacity-80">Hotel</span>{' '}
              <span className="font-serif text-[1.65rem] leading-[1.05] tracking-[0.02em]">{hotel.shortName}</span>
              <span className="sr-only">, back to top</span>
            </span>
          </a>

          <ul className="hidden items-center gap-1 xl:flex">
            {navItems.map((item) => {
              const isActive = active === item.id
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    aria-current={isActive ? 'true' : undefined}
                    className="group relative inline-flex min-h-11 items-center px-3 text-[0.78rem] font-semibold tracking-[0.08em]"
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-x-3 bottom-2 h-px origin-left bg-current transition-transform duration-500 ease-silk',
                        isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </a>
                </li>
              )
            })}
          </ul>

          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href="#contact"
              className={cn(
                'hidden min-h-11 items-center rounded-full px-5 text-[0.72rem] font-bold uppercase tracking-[0.18em] transition-colors duration-300 sm:inline-flex',
                light
                  ? 'bg-gold text-forest-night hover:bg-gold-light'
                  : 'bg-forest text-beige hover:bg-forest-soft',
              )}
            >
              Book / Enquire Now
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="relative grid size-12 place-items-center rounded-full xl:hidden"
            >
              <span className="relative block h-3 w-7">
                <motion.span
                  className="absolute left-0 top-0 block h-[1.5px] w-full bg-current"
                  animate={menuOpen ? { y: 5.25, rotate: 45 } : { y: 0, rotate: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
                <motion.span
                  className="absolute bottom-0 right-0 block h-[1.5px] w-full origin-right bg-current"
                  animate={menuOpen ? { y: -5.25, rotate: -45, scaleX: 1, originX: 0.5 } : { y: 0, rotate: 0, scaleX: 0.6 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                />
              </span>
            </button>
          </div>
        </nav>
      </motion.div>

      <MobileMenu open={menuOpen} onClose={closeMenu} containerRef={headerRef} active={active} />
    </header>
  )
}
