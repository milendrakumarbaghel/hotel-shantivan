/** Parses an <input type="date"> value (YYYY-MM-DD) as a local calendar date. */
export function parseLocalDate(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return null
  const [, y, m, d] = match.map(Number)
  const date = new Date(y, m - 1, d)
  // Reject impossible dates such as 2026-02-31.
  if (date.getFullYear() !== y || date.getMonth() !== m - 1 || date.getDate() !== d) return null
  return date
}

/** Today's date as YYYY-MM-DD in the visitor's local timezone. */
export function todayISO(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function addDaysISO(value: string, days: number): string {
  const date = parseLocalDate(value) ?? new Date()
  date.setDate(date.getDate() + days)
  return todayISO(date)
}

export function nightsBetween(checkIn: string, checkOut: string): number {
  const a = parseLocalDate(checkIn)
  const b = parseLocalDate(checkOut)
  if (!a || !b) return 0
  return Math.round((b.getTime() - a.getTime()) / 86_400_000)
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

/** "Tue, 10 Nov 2026" — formatted by hand so every browser produces the same text. */
export function formatDisplayDate(value: string): string {
  const date = parseLocalDate(value)
  if (!date) return value
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`
}
