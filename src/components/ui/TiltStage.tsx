import { motion, useMotionValue, useSpring, useTransform } from 'motion/react'
import type { PointerEvent, ReactNode } from 'react'
import { useFinePointer, usePrefersReducedMotion } from '../../hooks/useMediaQuery'
import { cn } from '../../lib/cn'

interface TiltStageProps {
  children: ReactNode
  className?: string
  /** Maximum rotation in degrees. Keep it subtle. */
  max?: number
}

/**
 * A CSS-3D stage that leans gently toward the pointer. Children can use
 * `translateZ` (e.g. `[transform:translateZ(60px)]`) to float at different depths.
 * Inert on touch devices and for reduced-motion visitors.
 */
export function TiltStage({ children, className, max = 5 }: TiltStageProps) {
  const finePointer = useFinePointer()
  const reducedMotion = usePrefersReducedMotion()
  const enabled = finePointer && !reducedMotion

  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const spring = { stiffness: 90, damping: 18, mass: 0.6 }
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), spring)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), spring)

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (!enabled || e.pointerType !== 'mouse') return
    const rect = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width - 0.5)
    py.set((e.clientY - rect.top) / rect.height - 0.5)
  }
  const reset = () => {
    px.set(0)
    py.set(0)
  }

  return (
    <div className={cn('[perspective:1400px]', className)} onPointerMove={onMove} onPointerLeave={reset}>
      <motion.div
        className="relative h-full w-full [transform-style:preserve-3d]"
        style={enabled ? { rotateX, rotateY } : undefined}
      >
        {children}
      </motion.div>
    </div>
  )
}
