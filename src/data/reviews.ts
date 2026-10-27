/**
 * Guest reviews.
 *
 * Only add GENUINE reviews supplied by the owner or copied (with permission)
 * from the hotel's Google Business Profile. Never write or paraphrase reviews.
 * While this list is empty the Reviews section shows an honest empty state.
 *
 * Example:
 * {
 *   id: 'g-2026-01',
 *   quote: 'Exact text of the review…',
 *   author: 'Guest name (only if they agreed to be named)',
 *   source: 'Google',
 *   rating: 5,           // only if it is the reviewer's actual rating
 *   date: 'January 2026' // optional
 * }
 */
export interface Review {
  id: string
  quote: string
  author: string | null
  source: 'Google' | 'Direct' | string
  rating: 1 | 2 | 3 | 4 | 5 | null
  date?: string
}

export const reviews: Review[] = []
