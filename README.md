# Nylonium

Product showcase site for Nylonium, a plastic film manufacturer.

This is not a storefront. Nothing is sold or paid for on the site — every call
to action routes the visitor to Telegram, WhatsApp, or a phone call, where the
actual conversation happens.

The interface is Persian and laid out right-to-left throughout.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # output in dist/
npm run preview
```

## Stack

- **React 19** + **Vite 8**
- **Tailwind CSS v4** — configured entirely in `src/index.css`; there is no
  `tailwind.config` file
- **lucide-react** for interface icons
- **Vazirmatn Variable**, bundled locally via `@fontsource-variable`, so the
  page makes no third-party requests
- No backend and no API

## Layout

```
src/
  data/site.js              all copy, products, links and contact details
  index.css                 colour tokens, light/dark themes, keyframes
  components/
    Navbar Hero Marquee Stats Products ProductRail Features
    Industries Process Testimonials Faq CtaBand Contact Footer
    FloatingContact PageLoader
    ui/  Logo ProductGlyph ProductCard Avatar Reveal SectionHeading
         useTheme useMediaQuery
```

Everything a non-developer would want to change lives in
[`src/data/site.js`](src/data/site.js).

## Design notes

**Colour.** Emerald (`--color-brand-*`) against a cool slate neutral
(`--color-ink-*`). Both themes are built. The visitor's choice is stored in
`localStorage`, and a small inline script in `index.html` applies it before the
first paint so the theme never flashes.

**Contrast.** Use the `--brand-ink` token for brand-coloured *text*, not
`brand-500`/`brand-600` directly. Measured against white, `brand-600` reaches
only 3.66:1 — under the 4.5:1 WCAG AA floor for small text — so `--brand-ink`
resolves to `brand-700` in the light theme and `brand-300` in the dark one.
Every text token clears AA in both themes.

**Motion.** Only `opacity` and `transform` are animated, which keeps the work
on the compositor thread and the page smooth on phones. Raised cards share one
hover contract (`.lift-card` / `.lift-chip`) so nothing snaps on the way in or
back out. All motion is disabled under `prefers-reduced-motion: reduce`.

**Loading.** Sections fade in slightly *before* they scroll into view, and
anything on the opening screen is shown synchronously at mount, so the page
reads as already loaded rather than assembling itself under the scroll.

**Responsive.** Verified from 320px up to wide desktop with no horizontal
scroll. Phones get one swipeable rail per product category — with arrows,
snap points and position dots — instead of the desktop filter-and-grid.

## Placeholder data

These values are stand-ins and should be replaced before launch. All of them
live in `src/data/site.js`.

| Item | Where | Note |
| --- | --- | --- |
| Product photography | `products[].image` (all `null`) | Cards currently render a bespoke SVG glyph in the image slot; set a path to replace it |
| Address and email | `contact.address`, `contact.email` | Sample values |
| Product specifications | `products[].specs` | Width and thickness ranges are estimates and must match real production capability |
| Customer testimonials | `testimonials` | Names and quotes are invented |
| Statistics | `stats` | Years, order count and province coverage are sample figures |
| Telegram link | `RAW_PHONE` | Built as `t.me/<phone>`; a `t.me/<username>` link is more reliable if one exists |

## Future pages

Only the landing page exists so far. The navbar links point at sections of this
page (`#p-uv`, `#p-shrink`, and so on); when interior pages are added, update
the `href` values in `src/data/site.js` to the real routes.
