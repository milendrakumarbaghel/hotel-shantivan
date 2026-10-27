import { StrictMode } from 'react'
import { prerenderToNodeStream } from 'react-dom/static'
import App from './App'

/**
 * Used at build time only (scripts/prerender.mjs) to emit static HTML for SEO and fast first paint.
 * `prerender` waits for lazy (Suspense) sections such as the booking form, so their markup is included.
 */
export async function render(): Promise<string> {
  const { prelude } = await prerenderToNodeStream(
    <StrictMode>
      <App />
    </StrictMode>,
  )
  let html = ''
  for await (const chunk of prelude) html += chunk.toString()
  return html
}
