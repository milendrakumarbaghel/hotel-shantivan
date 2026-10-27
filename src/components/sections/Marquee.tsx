const words = ['Nature', 'Comfort', 'Peace', 'Hospitality', 'Elegance']

/** Slow editorial band of the brand values — decorative, so hidden from screen readers. */
export function Marquee() {
  const row = (
    <div className="flex shrink-0 items-center">
      {words.map((word) => (
        <span key={word} className="flex items-center">
          <span className="px-6 font-serif text-[clamp(2.5rem,1.5rem+4vw,5.5rem)] italic leading-none text-forest sm:px-10">
            {word}
          </span>
          <span className="size-2 rotate-45 bg-gold" />
        </span>
      ))}
    </div>
  )
  return (
    <div aria-hidden className="overflow-hidden border-y border-forest/10 bg-beige py-8 sm:py-10">
      <div className="marquee-track flex w-max">
        {row}
        {row}
      </div>
    </div>
  )
}
