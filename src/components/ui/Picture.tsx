import type { CSSProperties, ImgHTMLAttributes } from 'react'
import { srcSetFor, type ImageAsset } from '../../config/media'
import { cn } from '../../lib/cn'

interface PictureProps {
  image: ImageAsset
  /** Rendered width hints for the browser, e.g. '(min-width: 1024px) 40vw, 90vw'. */
  sizes: string
  className?: string
  imgClassName?: string
  /** Above-the-fold images load eagerly with high priority. */
  priority?: boolean
  alt?: string
  objectPosition?: string
  style?: CSSProperties
  /** Mark decorative duplicates so screen readers skip them. */
  decorative?: boolean
  imgProps?: Pick<ImgHTMLAttributes<HTMLImageElement>, 'draggable'> & Record<`data-${string}`, string | boolean>
}

/**
 * AVIF → WebP → JPEG responsive picture with explicit dimensions (no layout shift)
 * and a tiny blurred placeholder painted behind the image while it loads.
 */
export function Picture({
  image,
  sizes,
  className,
  imgClassName,
  priority = false,
  alt,
  objectPosition = '50% 50%',
  style,
  decorative = false,
  imgProps,
}: PictureProps) {
  return (
    <picture className={cn('block', className)} style={style}>
      <source type="image/avif" srcSet={srcSetFor(image, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSetFor(image, 'webp')} sizes={sizes} />
      <img
        src={image.src}
        srcSet={srcSetFor(image, 'jpg')}
        sizes={sizes}
        width={image.width}
        height={image.height}
        alt={decorative ? '' : (alt ?? image.alt)}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn('h-full w-full object-cover', imgClassName)}
        style={{
          objectPosition,
          backgroundImage: `url("${image.lqip}")`,
          backgroundSize: 'cover',
          backgroundPosition: objectPosition,
        }}
        {...imgProps}
      />
    </picture>
  )
}
