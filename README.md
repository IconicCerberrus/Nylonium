# Nylonium

Product showcase site for Nylonium, a plastic film manufacturer.

This is not a storefront. Nothing is sold or paid for on the site — every call
to action opens a dialog offering Telegram, WhatsApp or a phone call, where the
actual conversation happens.

The interface is Persian and laid out right-to-left throughout.

## Getting started

```bash
npm install
npm run dev      # http://localhost:5183
npm run build    # output in dist/
npm run preview
```

`npm run gen` regenerates the HTML shells, the sitemap and robots.txt. It runs
automatically before `dev` and `build`, so you rarely need it by hand.

## Stack

- **React 19** + **Vite 8**, built as a multi-page app
- **Tailwind CSS v4** — configured entirely in `src/index.css`; there is no
  `tailwind.config` file
- **lucide-react** for interface icons
- **Vazirmatn Variable**, bundled locally via `@fontsource-variable`, so the
  page makes no third-party requests
- No backend and no API

## How the pages are built

There are 147 pages and none of their HTML is written by hand.
`scripts/gen-pages.mjs` reads `src/data` and emits every shell, along with
`public/sitemap.xml` and `public/robots.txt`. **Adding a product to the data
file is all it takes to get its page, its sitemap entry and its share tags.**

| Page | Source | Count |
| --- | --- | --- |
| Landing | `index.html` | 1 |
| Contact | `contact.html` | 1 |
| Product family | `tagheei.html`, `greenhouse.html`, `shrink.html`, `bags.html`, `stretch.html` | 5 |
| Full range per family | `*-all.html` | 5 |
| Individual variant | `product/<family>-<variant>.html` | 135 |

Variant pages live under `product/` so the project root does not collect a
hundred-odd files. Each shell declares its own depth in `data-root`, and links
built through `src/lib/links.js` use it — so a component never needs to know
which directory it is rendered from. Only the landing page carries `data-home`.

## Layout

```
src/
  entries/    one per HTML entry point: main, product, contact
  pages/      whole-page templates: Home, Family, AllProducts, Variant, Contact
  sections/   page sections: Hero, Products, Features, CategorySection, …
  layout/     Navbar, Footer, FloatingContact, PageLoader
  ui/         Modal, DetailDialog, ProductCard, VariantCard, Reveal, …
  hooks/      useTheme, useMediaQuery, useRetained
  context/    the contact dialog and its context
  data/       site.js (landing copy) and families/ (one catalogue per family)
  lib/        links.js
```

Everything a non-developer would want to change lives in
[`src/data/site.js`](src/data/site.js) and
[`src/data/families/`](src/data/families).

## Design notes

**Colour.** Emerald (`--color-brand-*`) against a cool slate neutral
(`--color-ink-*`). Both themes are built. The visitor's choice is stored in
`localStorage`, and a small inline script in every shell applies it before the
first paint so the theme never flashes.

**Contrast.** Use the `--brand-ink` token for brand-coloured *text*, not
`brand-500`/`brand-600` directly. Measured against white, `brand-600` reaches
only 3.66:1 — under the 4.5:1 WCAG AA floor for small text — so `--brand-ink`
resolves to `brand-700` in the light theme and `brand-300` in the dark one.
Every text token clears AA in both themes.

**Motion.** Only `opacity` and `transform` are animated. Raised cards share one
hover contract (`.lift-card` / `.lift-chip`). Dialogs get their entry state from
`@starting-style` rather than a JavaScript class flip, because timing a flip by
hand needs a frame that never arrives in a backgrounded tab. All motion is
disabled under `prefers-reduced-motion: reduce`.

**Responsive.** Verified from 320px up to wide desktop with no horizontal
scroll. Product categories are a three-column grid on desktop and a snapping
rail below that — three cards across on a tablet, one on a phone. The rail's
arrows sit in their own columns beside the track, so they cannot overlap a card.

**Loading.** One family catalogue is fetched per page rather than all five. The
body font is preloaded by a small build plugin that reads its hashed filename
out of the bundle.

## Placeholder data

These values are stand-ins and should be replaced before launch.

| Item | Where | Note |
| --- | --- | --- |
| Product photography | `gallery: []` throughout | Cards and variant pages render a bespoke SVG glyph in each image slot; add paths to replace |
| `og:image` | not set | A 1200×630 PNG would make links shared in Telegram show a picture instead of text only |
| Email | `src/data/site.js` → `emailAddresses` | Sample value |
| Product specifications | `src/data/families/*.js` | Widths and thicknesses are representative, and must match real production capability |
| Variant catalogue | `src/data/families/*.js` | 135 sample variants modelled on how the range is sold |
| Customer testimonials | `src/data/site.js` → `testimonials` | Names and quotes are invented |
| Statistics | `src/data/site.js` → `stats` | Years, order count and province coverage are sample figures |
| Telegram link | `src/data/site.js` → `phoneNumbers` | Built as `t.me/<phone>`; a `t.me/<username>` link is more reliable if one exists |

## Known gaps

- **Variant pages share their family's prose.** Only the title, specifications
  and intro differ between the 27 variants of a family, which search engines
  read as duplicate content. Two or three sentences per variant would fix it.
- **Everything renders client-side.** Pre-rendering to static HTML would cut
  the JavaScript a visitor needs before first paint, and let crawlers read the
  content without executing anything. It needs the browser-only code
  (`links.js`, `useTheme`, `useMediaQuery`, `PageLoader`, `Modal`'s portal) to
  be guarded first.
