# Hotel Shantione — Website

A cinematic, single-page website for **Hotel Shantione**, Suktara, Seoni (Madhya Pradesh 480661) — in front of Redbird Airport (Suktara Domestic Airport) on Badalpar Road.

Static site: React + TypeScript + Vite, prerendered to HTML at build time. No backend, database or login. Enquiries go straight to the hotel over WhatsApp.

---

## Quick start

Requires **Node.js 20.19+** (22 LTS recommended — see `.nvmrc`).

```bash
npm install        # install dependencies
npm run dev        # local development server → http://localhost:5173
npm run build      # type-check, build and prerender into dist/
npm run preview    # serve the production build → http://localhost:4173
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript project check |
| `npm test` | Unit tests (booking validation, WhatsApp message, links) |
| `npm run media` | Rebuild **all** web media from `media/originals` (macOS: videos use AVFoundation) |
| `npm run media:images` | Rebuild images only (any OS) |

---

## ⚠️ Before going live — information still needed from the owner

The site is built so nothing is invented. These items are **not yet confirmed**, so the related UI is hidden or neutral until they are filled in:

| Item | Where | Effect while missing |
| --- | --- | --- |
| **Production domain** | `siteUrl` | No canonical URL / sitemap.xml; social image URL is relative |
| Google Map embed (optional) | `map.embedUrl` | A schematic, “not to scale” landmark diagram is shown |
| **Room categories / tariffs / occupancy** | `src/data/rooms.ts` | Cards use descriptive titles (e.g. “Coral & Indigo”) and say “Category & tariff shared on enquiry” |
| **Guest reviews** | `src/data/reviews.ts` | An honest “reviews coming soon” state is shown |
| Google review link (optional) | `googleReviewUrl` | “Review us on Google” button hidden |

> **Name:** the website brand is **“Hotel Shantione”** (the signage and towels in the supplied photos read “Hotel Shanti One — Restro | Lodge”). To change it, update `name` / `shortName` in `src/config/hotel.ts`. Everything else (SEO tags, intro, footer, messages) follows automatically.

---

## Updating content

Everything an owner might change lives in **`src/config/`** and **`src/data/`**. Components never hard-code business details.

### Contact details, address, map, domain — `src/config/hotel.ts`

```ts
contact: {
  phones: ['+91 79993 84893', '+91 70000 45162'],  // shown to guests, used for tel: links (primary first)
  whatsapp: '919876543210',   // country code + number, digits only
  email: 'Shantione8@gmail.com',
},
map: {
  placeUrl: 'https://maps.app.goo.gl/pdMDffmvqNE3yqKM8',  // used by every “Get Directions” link
  coordinates: { lat: 22.0, lng: 79.0 },  // only if verified
  embedUrl: null,
  …
},
siteUrl: 'https://www.example.com',
```

This file also feeds the build-time SEO tags, `robots.txt`, `sitemap.xml` and the schema.org `Hotel` data.

### Rooms — `src/data/rooms.ts`

Each room has `name` (official category, `null` until confirmed), `descriptor` (fallback title), `description`, `image`, optional hover `video`, `features`, and optional `occupancy` / `price` (shown only when set). The booking form’s “Preferred room” options (AC Room / Non-AC Room) are `roomPreferences` in the same file.

### Facilities — `src/data/amenities.ts`

Currently Air Conditioner, Dining Hall and Garden. Icons: `air-vent`, `utensils`, `trees` (add more in `src/components/sections/Amenities.tsx` from [Lucide](https://lucide.dev/icons)). **Only list services the hotel really offers.**

### Reviews — `src/data/reviews.ts`

Paste genuine reviews only (exact text, the reviewer’s real rating, a name only with permission). Once the list has entries, the carousel appears automatically: keyboard arrows, swipe and buttons.

### Gallery — `src/data/gallery.ts`

Order and tile shape (`feature`, `tall`, `square`, `wide`) of photos and clips, plus their filter group.

### Alt text and captions — `src/config/media.ts`

Every photo and video has curated alt text and a caption. `featured` picks which media appears in the hero, About, Location and the immersive section.

---

## Updating photos and videos

Originals live in **`media/originals/`** (never shipped). Web-ready files are generated into `public/assets/`:

```
public/assets/
  images/      full-quality JPEG masters (cropped where needed)
  optimized/   AVIF + WebP + JPEG at 480 / 640 / 960 px
  posters/     lightweight video posters (WebP + JPEG)
  videos/      MP4 (H.264), audio track removed, fast-start
```

**To add or replace media:**

1. Copy the new file into `media/originals/`.
2. Add or adjust an entry in `media/media-sources.json` (`images`, `videos`, or `stills` = a frame grabbed from a video). Images can have an optional `crop`.
3. Run `npm run media` (macOS) or `npm run media:images` (images only, any OS).
4. Add alt text and a caption for the new id in `src/config/media.ts`. TypeScript will flag any id that is missing copy.
5. Use the id in `rooms.ts`, `gallery.ts` or `featured`.

`npm run media` also regenerates `public/og-image.jpg` (social preview) and `src/config/media.generated.ts` (dimensions and blur placeholders — do not edit by hand).

**About the current media:** all supplied photos and clips are portrait phone media at 464–960 px wide (WhatsApp-compressed). The design frames them in portrait arches rather than stretching them full-width on desktop. For a sharper hero, supply the original camera files (ideally 4K landscape video and full-resolution photos) and re-run `npm run media`. Without ffmpeg, WebM versions are not generated; the H.264 MP4s play in all modern browsers.

---

## Project structure

```
src/
  config/        hotel.ts (business info) · media.ts (manifest) · media.generated.ts
  data/          rooms · amenities · reviews · gallery · navigation
  lib/           booking schema (Zod) · WhatsApp messages · contact links · dates · GSAP setup
  hooks/         media queries · viewport · device profile
  components/
    animations/  useReveal — declarative scroll reveals (data-reveal / data-parallax)
    layout/      Navbar · MobileMenu · Footer · FloatingWhatsApp
    providers/   SmoothScroll (Lenis + ScrollTrigger) · EnquiryProvider · contexts
    sections/    Hero · About · Marquee · Rooms · Gallery · Lightbox · Amenities ·
                 ImmersiveSection · Reviews · Location · Booking · BookingForm
    three/       LanternField (React Three Fiber, lazy-loaded)
    ui/          Button · Picture · LazyVideo · TiltStage · CursorLabel · Typography · Icons
  styles/        index.css (Tailwind v4 theme, fluid type tokens, intro curtain)
  entry-server.tsx  build-time prerender entry
scripts/         optimize-media.mjs · process-videos.swift · prerender.mjs
media/           originals + media-sources.json
```

## How it works

- **Design system:** forest green `#244A36`, warm beige `#F4EFE5`, muted gold `#C5A46D`, dark text `#292D29`. Darker and lighter gold variants keep small text at WCAG AA contrast. Type is Cormorant Garamond (headings) and Manrope (body), self-hosted, with all sizes fluid via `clamp()`.
- **Animation split:** GSAP + ScrollTrigger drive scroll-linked work (hero entrance and parallax, masked reveals, the immersive corridor, the footer wordmark). Motion for React handles UI state (menu, lightbox, carousel, filters, magnetic buttons, hover). The two never animate the same property on the same element. Everything is cleaned up on unmount via `useGSAP` / `gsap.matchMedia`.
- **Smooth scrolling:** Lenis, synced to the GSAP ticker. It is disabled for `prefers-reduced-motion`, and touch scrolling stays native.
- **3D:** the “Walk Through Shantione” section is a CSS-3D corridor of real photographs driven by scroll (sticky, not pinned). Behind it, a tiny React Three Fiber scene (~250 points) evokes the garden’s string lights. The WebGL chunk loads only on capable desktops (no reduced motion or data saver, at least 4 cores and 4 GB RAM), only near the section, and renders only while visible. Phones and reduced-motion visitors get a static layered composition.
- **Prerendering:** `npm run build` renders the full page to static HTML (SEO, social previews, content visible without JavaScript), inlines the CSS, then hydrates in the browser. The booking form’s code (React Hook Form + Zod) is split out and loads on demand.
- **Booking:** validated with Zod (required fields, 10–15-digit phone, no past dates, check-out after check-in, 1–20 guests). The result is a formatted, URL-encoded WhatsApp message. The site always states that a booking is confirmed only after the hotel verifies availability.

## Deployment

The build output in **`dist/`** is fully static, so any static host works.

- **Netlify:** connect the repo. `netlify.toml` sets the build command, Node 22, caching and security headers.
- **Vercel:** import the repo. `vercel.json` sets the same headers.
- **Other hosts / cPanel:** run `npm run build` and upload the contents of `dist/`.

Caching: `/static/*` (hashed JS/CSS/fonts) is immutable for a year, and `/assets/*` (media, unhashed) is cached for a week.

**Security headers** include a strict Content-Security-Policy (`script-src 'self'`, no inline scripts; the prerender step fails the build if one appears). The policy is defined in `vite.config.ts` (also applied to `npm run preview`) and mirrored in `netlify.toml` and `vercel.json`. Keep all three in sync. If you add a third-party service (analytics, chat widget…), extend the CSP accordingly.

## Quality checks performed

Results from the local production build (`npm run preview`, Chrome headless):

- `tsc -b`, ESLint, and 27 unit tests: passing.
- Responsive sweep at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 px: no horizontal overflow, no console errors or warnings, and no failed requests (with the CSP active).
- 39 scripted interaction checks: mobile menu (focus trap, Escape, close on link), anchor scrolling, lightbox (keyboard, focus restore, scroll lock), gallery filters, room enquiry hand-off, form validation and submission, reduced-motion behaviour, and no-JavaScript content. A separate run with a dummy WhatsApp number verified the `wa.me` links and message encoding.
- Lighthouse (default throttling, local server):
  - Desktop: Performance 98–99, Accessibility 100, Best Practices 100, SEO 100.
  - Mobile: Performance 84–87, Accessibility 100, Best Practices 100, SEO 100.
  - Real-world scores depend on the host and network, so re-measure after deployment.
