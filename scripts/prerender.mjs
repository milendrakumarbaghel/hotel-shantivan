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

await writeFile(indexPath, template.replace('<div id="root"></div>', `<div id="root">${appHtml}</div>`))
await rm(ssrDir, { recursive: true, force: true })
console.log(`prerender: wrote ${(appHtml.length / 1024).toFixed(1)} kB of HTML into dist/index.html`)
