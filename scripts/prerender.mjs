// Injects the server-rendered React markup into dist/index.html so the page is
// fully readable before JavaScript runs (SEO, social previews, faster first paint).
import { readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { pathToFileURL } from 'node:url'

const root = process.cwd()
const ssrDir = path.join(root, 'dist-ssr')
const indexPath = path.join(root, 'dist', 'index.html')

const { render } = await import(pathToFileURL(path.join(ssrDir, 'entry-server.js')).href)
const appHtml = await render()
const template = await readFile(indexPath, 'utf8')

if (!template.includes('<div id="root"></div>')) {
  throw new Error('prerender: <div id="root"></div> not found in dist/index.html')
}

let html = template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`)

// Inline the (single) stylesheet so first paint does not wait on an extra request.
const cssLink = /<link rel="stylesheet" crossorigin href="(\/static\/[^"]+\.css)">/.exec(html)
if (cssLink) {
  const css = await readFile(path.join(root, 'dist', cssLink[1]), 'utf8')
  html = html.replace(cssLink[0], () => `<style>${css}</style>`)
}

await writeFile(indexPath, html)
await rm(ssrDir, { recursive: true, force: true })
console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html${cssLink ? ' (CSS inlined)' : ''}`)
