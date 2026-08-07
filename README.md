# Transfer2EU — Site UI kit

> Note: this README documents the original prototype. The live site is a
> prerendered React + Vite SPA (see `scripts/prerender.mjs`).

## Performance / images

- `npm run build` — Vite build + prerender of every page + `sitemap.xml`.
- `npm run optimize:images` — re-encodes all photos in `public/assets`
  (guide/news/routes): resizes to their real display size, strips metadata,
  converts the heavy news PNGs to JPEG and updates `News.data.json`.
  Idempotent — safe to re-run after new images are fetched.

## Components

- `index.html` is the assembly: it loads React 18 + Babel, mounts the components below, and lets you switch between the home view and a sample route page (`/routes/warsaw-berlin`).
- All visuals come from `../../colors_and_type.css`.
- Icons load from the Lucide CDN (see `Icon.jsx`).

## Components

| File | What it is |
|---|---|
| `Button.jsx` | Primary / secondary / ghost / link variants |
| `Icon.jsx` | Lucide icon wrapper |
| `Header.jsx` | Sticky header, blurs on scroll, nav + lang switcher |
| `Hero.jsx` | Full-bleed photo hero with overlaid `BookingForm` |
| `BookingForm.jsx` | Откуда / Куда / Дата / Пассажиры → Рассчитать |
| `RouteCard.jsx` | The card used in the popular-routes carousel + route catalog grid |
| `PopularRoutes.jsx` | Carousel section of `RouteCard`s |
| `WhyUs.jsx` | 4-up feature row over photographic background |
| `HowItWorks.jsx` | 3-step explainer |
| `Testimonial.jsx` | Single review with avatar + stars |
| `FAQ.jsx` | Accordion of common questions |
| `CTABanner.jsx` | Full-bleed photo CTA before footer |
| `Footer.jsx` | 4-column footer + subscribe |
| `RoutePage.jsx` | The SEO route detail page (e.g. Варшава → Берлин) |

## Notes / shortcuts

- Photography is **placeholder gradients + city silhouette layers** — replace with real licensed photography for production. The aesthetic, hierarchy, and overlay treatment are correct.
- Booking, language switching, and form submission are **non-functional** — visual only.
- The route grid in `RoutePage` is hardcoded; in production these are SEO pages generated server-side.
