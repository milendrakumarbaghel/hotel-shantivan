import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import { hotel } from './src/config/hotel.ts'

const escape = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/**
 * Injects SEO tags and the intro curtain into index.html from src/config/hotel.ts,
 * and emits robots.txt (+ sitemap.xml once `siteUrl` is configured).
 */
function hotelSeo(): Plugin {
  const title = `${hotel.name} — ${hotel.tagline} | ${hotel.address.locality}, ${hotel.address.city}`
  const site = hotel.siteUrl?.replace(/\/$/, '') ?? null
  const ogImage = site ? `${site}/og-image.jpg` : '/og-image.jpg'
  let isSsrBuild = false

  const head = [
    `<title>${escape(title)}</title>`,
    `<meta name="description" content="${escape(hotel.seoDescription)}" />`,
    `<meta name="robots" content="index, follow, max-image-preview:large" />`,
    site && `<link rel="canonical" href="${site}/" />`,
    `<meta name="geo.region" content="IN-MP" />`,
    `<meta name="geo.placename" content="${escape(`${hotel.address.locality}, ${hotel.address.city}`)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${escape(hotel.name)}" />`,
    `<meta property="og:title" content="${escape(title)}" />`,
    `<meta property="og:description" content="${escape(hotel.seoDescription)}" />`,
    `<meta property="og:locale" content="en_IN" />`,
    site && `<meta property="og:url" content="${site}/" />`,
    `<meta property="og:image" content="${ogImage}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:image:alt" content="${escape(`${hotel.name} — entrance, guest room and garden`)}" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" content="${escape(title)}" />`,
    `<meta name="twitter:description" content="${escape(hotel.seoDescription)}" />`,
    `<meta name="twitter:image" content="${ogImage}" />`,
  ]
    .filter(Boolean)
    .join('\n    ')

  const letters = hotel.shortName
    .split('')
    .map((l, i) => `<span style="--i:${i}">${escape(l)}</span>`)
    .join('')
  const curtain = `<div class="intro" aria-hidden="true"><div class="intro__mark"><span class="intro__meta">Hotel</span><span class="intro__word">${letters}</span><span class="intro__rule"></span><span class="intro__meta">${escape(`${hotel.address.locality} · ${hotel.address.city}`)}</span></div></div>`

  return {
    name: 'hotel-seo',
    configResolved(config) {
      isSsrBuild = Boolean(config.build.ssr)
    },
    transformIndexHtml(html) {
      return html.replace('<!--seo-head-->', head).replace('<!--intro-curtain-->', curtain)
    },
    generateBundle() {
      if (isSsrBuild) return
      const robots = ['User-agent: *', 'Allow: /', site ? `\nSitemap: ${site}/sitemap.xml` : ''].join('\n')
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: `${robots.trim()}\n` })
      if (site) {
        const lastmod = new Date().toISOString().slice(0, 10)
        this.emitFile({
          type: 'asset',
          fileName: 'sitemap.xml',
          source: `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url><loc>${site}/</loc><lastmod>${lastmod}</lastmod><changefreq>monthly</changefreq><priority>1.0</priority></url>\n</urlset>\n`,
        })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), hotelSeo()],
  build: {
    // Hashed bundles live in /static so they never mix with the (unhashed) media in /assets.
    assetsDir: 'static',
    target: 'es2022',
    chunkSizeWarningLimit: 900,
  },
  ssr: {
    // Bundle dependencies into the prerender build (gsap/motion ship ESM that Node can't import directly).
    noExternal: true,
  },
})
