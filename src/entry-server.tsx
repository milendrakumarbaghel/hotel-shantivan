import { StrictMode } from 'react'
import { renderToString } from 'react-dom/server'
import { prerenderToNodeStream } from 'react-dom/static'
import App from './App'

const app = (
  <StrictMode>
    <App />
  </StrictMode>
)

/**
 * Used at build time only (scripts/prerender.mjs) to emit static HTML for SEO and fast first paint.
 *
 * Pass 1 (`prerender`) waits for lazy sections such as the booking form so their chunks resolve.
 * Pass 2 (`renderToString`) then renders everything inline. Unlike the streaming APIs it emits no
 * inline helper scripts, which the strict Content-Security-Policy (script-src 'self') would block.
 */
export async function render(): Promise<string> {
  const { prelude } = await prerenderToNodeStream(app)
  for await (const chunk of prelude as unknown as AsyncIterable<unknown>) void chunk // drain

  const html = renderToString(app)
  if (/<script(?![^>]*type="application\/ld\+json")/.test(html)) {
    throw new Error('prerender: unexpected inline <script> in output — it would be blocked by the CSP')
  }
  if (html.includes('<!--$!-->')) {
    throw new Error('prerender: a Suspense boundary did not resolve — its content would be missing from the HTML')
  }
  return html
}
