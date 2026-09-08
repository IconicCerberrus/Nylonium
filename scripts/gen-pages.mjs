/**
 * Generates every HTML shell from src/data/pages.js.
 *
 * The shells are pure scaffolding — a head, a root div and the shared entry
 * script — so keeping them in step with the data by hand would be busywork and
 * a source of drift. This runs as `prebuild` and `predev`, which means adding a
 * product to the data file is all it takes to get its page.
 *
 * Variant pages go in product/ rather than the project root, which would
 * otherwise collect well over a hundred files.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const { productPages, allVariants, variantSlug } = await import(
  new URL('../src/data/pages.js', import.meta.url)
)

/** Escapes the few characters that would break an HTML attribute. */
const attr = (s) => String(s).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')

function shell({ pageId, view, variantId, title, description, depth = 0 }) {
  const up = '../'.repeat(depth)
  return `<!doctype html>
<html lang="fa" dir="rtl" data-page="${attr(pageId)}" data-view="${view}"${
    variantId ? ` data-variant="${attr(variantId)}"` : ''
  } data-root="${up}">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#059669" />
    <meta name="description" content="${attr(description)}" />
    <title>${attr(title)}</title>
    <script>
      // Prevent theme flash: apply stored/system theme before first paint.
      (function () {
        try {
          var stored = localStorage.getItem('nylonium-theme');
          var dark = stored
            ? stored === 'dark'
            : window.matchMedia('(prefers-color-scheme: dark)').matches;
          document.documentElement.classList.toggle('dark', dark);
          document.documentElement.style.colorScheme = dark ? 'dark' : 'light';
        } catch (e) {}
      })();
    </script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/pages/product.jsx"></script>
  </body>
</html>
`
}

// Start from a clean product/ so a renamed variant never leaves a stale page.
const productDir = resolve(root, 'product')
rmSync(productDir, { recursive: true, force: true })
mkdirSync(productDir, { recursive: true })

let familyCount = 0
let variantCount = 0

for (const page of productPages) {
  writeFileSync(
    resolve(root, page.slug),
    shell({
      pageId: page.id,
      view: 'family',
      title: page.metaTitle,
      description: page.metaDescription,
    }),
  )

  writeFileSync(
    resolve(root, page.allSlug),
    shell({
      pageId: page.id,
      view: 'all',
      title: `همه محصولات ${page.title} | نایلونیوم`,
      description: `فهرست کامل تنوع‌های ${page.title} تولید نایلونیوم در عرض، ضخامت و رنگ‌های مختلف.`,
    }),
  )
  familyCount += 2

  for (const variant of allVariants(page)) {
    const specs = variant.specs.map((s) => `${s.k}: ${s.v}`).join('، ')
    writeFileSync(
      resolve(root, variantSlug(page.id, variant.id)),
      shell({
        pageId: page.id,
        view: 'variant',
        variantId: variant.id,
        depth: 1,
        title: `${variant.title} | ${page.title} — نایلونیوم`,
        description: `${variant.title} — ${variant.short}. ${specs}. تولید نایلونیوم با امکان سفارش در ابعاد دلخواه.`,
      }),
    )
    variantCount++
  }
}

const rootPages = readdirSync(root).filter((f) => f.endsWith('.html')).length
console.log(
  `generated ${familyCount} family/all shells and ${variantCount} variant shells ` +
    `(${rootPages} html at root, ${variantCount} in product/)`,
)
