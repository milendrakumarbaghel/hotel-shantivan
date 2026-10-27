type ClassValue = string | false | null | undefined

/** Tiny className joiner — avoids pulling in a dependency for one function. */
export function cn(...classes: ClassValue[]) {
  return classes.filter(Boolean).join(' ')
}
