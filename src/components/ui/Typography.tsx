import type { ElementType, ReactNode } from 'react'
import { cn } from '../../lib/cn'

type Tone = 'light' | 'dark'

export function Overline({ children, tone = 'dark', className }: { children: ReactNode; tone?: Tone; className?: string }) {
  return (
    <p
      className={cn(
        'text-overline flex items-center gap-3',
        tone === 'dark' ? 'text-gold-deep' : 'text-gold-light',
        className,
      )}
    >
      <span aria-hidden className={cn('h-px w-8', tone === 'dark' ? 'bg-gold-deep/60' : 'bg-gold-light/60')} />
      {children}
    </p>
  )
}

interface SplitHeadingProps {
  /** Each entry is rendered as its own masked line. Wrap words in <em> for italic accents. */
  lines: ReactNode[]
  as?: ElementType
  className?: string
  delay?: number
  /** Opt out of the scroll-triggered reveal (e.g. when a parent timeline animates it). */
  reveal?: boolean
  id?: string
}

/**
 * Headline split into deliberate editorial lines. Each line sits in an
 * overflow mask so it can slide up into view (see useReveal → data-reveal="lines").
 * Lines are authored, not measured, so markup is identical on server and client.
 */
export function SplitHeading({ lines, as: Tag = 'h2', className, delay, reveal = true, id }: SplitHeadingProps) {
  return (
    <Tag
      id={id}
      className={className}
      data-reveal={reveal ? 'lines' : undefined}
      data-delay={delay}
    >
      {lines.map((line, i) => (
        <span key={i} className="line-mask block">
          <span data-line className="block will-change-transform">
            {line}
          </span>
        </span>
      ))}
    </Tag>
  )
}
