import { motion, useMotionValue, useSpring } from 'motion/react'
import type { MouseEvent, ReactNode } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'

type Variant = 'gold' | 'light' | 'outline-light' | 'outline-dark' | 'forest'
type Size = 'md' | 'lg'

interface BaseProps {
  children: ReactNode
  variant?: Variant
  size?: Size
  icon?: ReactNode
  className?: string
  /** Magnetic pull towards the pointer (desktop fine pointers only). */
  magnetic?: boolean
  'aria-label'?: string
}

type AnchorProps = BaseProps & { href: string; external?: boolean; onClick?: (e: MouseEvent) => void }
type NativeButtonProps = BaseProps & {
  href?: undefined
  type?: 'button' | 'submit'
  onClick?: (e: MouseEvent) => void
  disabled?: boolean
}

const variants: Record<Variant, string> = {
  gold: 'bg-gold text-forest-night hover:bg-gold-light',
  light: 'bg-beige text-forest hover:bg-white',
  forest: 'bg-forest text-beige hover:bg-forest-soft',
  'outline-light': 'border border-beige/45 text-beige hover:border-gold-light hover:text-gold-light',
  'outline-dark': 'border border-forest/30 text-forest hover:border-forest hover:bg-forest hover:text-beige',
}

const sizes: Record<Size, string> = {
  md: 'min-h-12 px-6 text-[0.8rem]',
  lg: 'min-h-14 px-8 text-[0.85rem]',
}

export function Button(props: AnchorProps | NativeButtonProps) {
  const { children, variant = 'gold', size = 'md', icon, className, magnetic = true } = props
  const finePointer = useFinePointer()
  const reducedMotion = usePrefersReducedMotion()
  const enableMagnet = magnetic && finePointer && !reducedMotion

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.4 })
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.4 })

  const onMove = (e: MouseEvent<HTMLElement>) => {
    if (!enableMagnet) return
    const rect = e.currentTarget.getBoundingClientRect()
    x.set((e.clientX - rect.left - rect.width / 2) * 0.22)
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3)
  }
  const onLeave = () => {
    x.set(0)
    y.set(0)
  }

  const classes = cn(
    'group/btn relative inline-flex items-center justify-center gap-3 rounded-full font-sans font-semibold uppercase tracking-[0.16em]',
    'transition-[background-color,color,border-color,box-shadow] duration-300 ease-silk',
    'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-gold',
    'disabled:cursor-not-allowed disabled:opacity-60',
    variants[variant],
    sizes[size],
    className,
  )

  const content = (
    <>
      <span className="relative">{children}</span>
      {icon && (
        <span className="relative inline-flex transition-transform duration-300 ease-silk group-hover/btn:translate-x-1">
          {icon}
        </span>
      )}
    </>
  )

  const motionProps = {
    className: classes,
    style: { x: sx, y: sy },
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    whileTap: reducedMotion ? undefined : { scale: 0.97 },
    'aria-label': props['aria-label'],
  }

  if (props.href !== undefined) {
    return (
      <motion.a
        {...motionProps}
        href={props.href}
        onClick={props.onClick}
        {...(props.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </motion.a>
    )
  }

  return (
    <motion.button {...motionProps} type={props.type ?? 'button'} onClick={props.onClick} disabled={props.disabled}>
      {content}
    </motion.button>
  )
}
