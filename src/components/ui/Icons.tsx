import type { SVGProps } from 'react'

/** WhatsApp glyph (brand icons are not part of Lucide). */
export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.79-1.47-1.76-1.65-2.06-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.58-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35Zm-5.42 7.4h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.74.98 1-3.65-.24-.37a9.86 9.86 0 0 1-1.51-5.26c0-5.45 4.44-9.88 9.9-9.88a9.83 9.83 0 0 1 6.99 2.9 9.82 9.82 0 0 1 2.9 6.99c-.01 5.45-4.44 9.88-9.9 9.88Zm8.42-18.3A11.81 11.81 0 0 0 12.05 0C5.5 0 .16 5.34.16 11.89c0 2.1.55 4.14 1.59 5.95L.06 24l6.3-1.65a11.88 11.88 0 0 0 5.68 1.45h.01c6.55 0 11.89-5.34 11.89-11.89a11.82 11.82 0 0 0-3.48-8.41Z" />
    </svg>
  )
}

/** Shantivan monogram — an arch (echoing the hotel's arched doorways) holding a leaf. */
export function Monogram(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 48" fill="none" aria-hidden="true" {...props}>
      <path d="M3 47V20C3 10.6 10.6 3 20 3s17 7.6 17 17v27" stroke="currentColor" strokeWidth="1.6" />
      <path d="M9 47V21c0-6.1 4.9-11 11-11s11 4.9 11 11v26" stroke="currentColor" strokeWidth="0.9" opacity=".55" />
      <path
        d="M20 40c0-9 2.6-15.2 7.6-19.4C21 21.4 17 26.6 17.6 33.4c-2.4-3.2-2.6-6.8-.8-10.6-4.6 3.8-5 10.4 3.2 17.2Z"
        fill="currentColor"
      />
    </svg>
  )
}
