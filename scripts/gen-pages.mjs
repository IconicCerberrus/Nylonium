/**
 * Generates every HTML shell, plus robots.txt and the sitemap, from the data
 * in src/data.
 *
 * The shells are scaffolding — head tags, a root div and an entry script — so
 * keeping 146 of them in step by hand would be busywork and a source of
 * drift. This runs as `predev` and `prebuild`, which means adding a product
 * to the data file is all it takes to get its page, its sitemap entry and its
 * share tags.
 *
 * Variant pages go in product/ rather than the project root, which would
 * otherwise collect well over a hundred files.
 */
import { mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { OG_HEIGHT, OG_WIDTH, renderOgCard } from './og-card.mjs'

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '..')

const { productPages } = await import(new URL('../src/data/families/all.js', import.meta.url))
const { allVariants, variantSlug } = await import(new URL('../src/data/pages.js', import.meta.url))
const { site, siteUrl, contact, phoneNumbers } = await import(
  new URL('../src/data/site.js', import.meta.url)
)

/** Escapes the characters that would break out of an HTML attribute. */
const attr = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')

/** Absolute URL for a page, which canonical, OG and the sitemap all need. */
const abs = (path) => `${siteUrl}/${path}`.replace(/\/+$/, path ? '' : '/')

const organization = {
  '@type': 'Organization',
  name: site.name,
  alternateName: site.nameLatin,
  url: siteUrl,
  description: site.tagline,
  telephone: phoneNumbers.map((n) => n.raw),
  email: contact.email,
  contactPoint: {
    '@type': 'ContactPoint',
    telephone: phoneNumbers[0].raw,
    contactType: 'sales',
    availableLanguage: ['fa'],
  },
}

function jsonLd(graph) {
  // </script> inside JSON would close the tag early.
  const json = JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }).replace(
    /<\//g,
    '<\\/',
  )
  return `    <script type="application/ld+json">${json}</script>\n`
}

function breadcrumbs(trail) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.path),
    })),
  }
}

function shell({
  pageId,
  view,
  variantId,
  title,
  description,
  path,
  depth = 0,
  entry,
  graph,
  home = false,
}) {
  const up = '../'.repeat(depth)
  const url = abs(path)
  // Marked explicitly: several pages have no product id, and inferring
  // "this is the landing page" from its absence made in-page anchors on the
  // contact page point at sections that only exist on the home page.
  const dataHome = home ? ' data-home' : ''
  const dataPage = pageId ? ` data-page="${attr(pageId)}"` : ''
  const dataView = view ? ` data-view="${view}"` : ''
  const dataVariant = variantId ? ` data-variant="${attr(variantId)}"` : ''

  return `<!doctype html>
<html lang="fa" dir="rtl"${dataHome}${dataPage}${dataView}${dataVariant} data-root="${up}">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="${up}favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#059669" />
    <meta name="description" content="${attr(description)}" />
    <link rel="canonical" href="${attr(url)}" />
    <title>${attr(title)}</title>

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${attr(site.name)}" />
    <meta property="og:locale" content="fa_IR" />
    <meta property="og:title" content="${attr(title)}" />
    <meta property="og:description" content="${attr(description)}" />
    <meta property="og:url" content="${attr(url)}" />
    <!-- Absolute, and it has to be: the crawler that reads this is not the
         browser that loaded the page, so it has no base to resolve against. -->
    <meta property="og:image" content="${attr(abs('og.png'))}" />
    <meta property="og:image:width" content="${OG_WIDTH}" />
    <meta property="og:image:height" content="${OG_HEIGHT}" />
    <meta property="og:image:alt" content="${attr(site.name)} — ${attr(site.tagline)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${attr(title)}" />
    <meta name="twitter:description" content="${attr(description)}" />
    <meta name="twitter:image" content="${attr(abs('og.png'))}" />

${jsonLd(graph)}
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
    <script type="module" src="${entry}"></script>
  </body>
</html>
`
}

// Start from a clean product/ so a renamed variant never leaves a stale page.
const productDir = resolve(root, 'product')
rmSync(productDir, { recursive: true, force: true })
mkdirSync(productDir, { recursive: true })

/** Every generated URL, for the sitemap. Higher priority = more important. */
const urls = []
const record = (path, priority) => urls.push({ path, priority })

// ── Landing page ──────────────────────────────────────────────────────
writeFileSync(
  resolve(root, 'index.html'),
  shell({
    home: true,
    view: null,
    path: '',
    entry: '/src/entries/main.jsx',
    title: `${site.name} | تولید انواع نایلون صنعتی، کشاورزی و بسته‌بندی`,
    description:
      'نایلونیوم — تولیدکننده انواع نایلون طاقه‌ای، نایلون یووی گلخانه‌ای، مالچ کشاورزی، شیرینک، حبابی، استرچ و کیسه نایلون در ابعاد مختلف.',
    graph: [
      organization,
      { '@type': 'WebSite', name: site.name, url: siteUrl, inLanguage: 'fa-IR' },
    ],
  }),
)
record('', '1.0')

// ── Contact ───────────────────────────────────────────────────────────
writeFileSync(
  resolve(root, 'contact.html'),
  shell({
    view: null,
    path: 'contact.html',
    entry: '/src/entries/contact.jsx',
    title: `تماس با ما | ${site.name}`,
    description: `راه‌های ارتباط با ${site.name} — تلگرام، واتساپ، تماس تلفنی و ایمیل. استعلام قیمت روز و مشاوره فنی رایگان.`,
    graph: [
      organization,
      breadcrumbs([
        { name: 'خانه', path: '' },
        { name: 'تماس با ما', path: 'contact.html' },
      ]),
      { '@type': 'ContactPage', name: 'تماس با ما', url: abs('contact.html'), inLanguage: 'fa-IR' },
    ],
  }),
)
record('contact.html', '0.9')

let familyCount = 2
let variantCount = 0

for (const page of productPages) {
  const variants = allVariants(page)

  writeFileSync(
    resolve(root, page.slug),
    shell({
      pageId: page.id,
      view: 'family',
      path: page.slug,
      entry: '/src/entries/product.jsx',
      title: page.metaTitle,
      description: page.metaDescription,
      graph: [
        organization,
        breadcrumbs([
          { name: 'خانه', path: '' },
          { name: page.title, path: page.slug },
        ]),
        {
          '@type': 'CollectionPage',
          name: page.title,
          description: page.metaDescription,
          url: abs(page.slug),
          inLanguage: 'fa-IR',
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: variants.length,
            itemListElement: variants.slice(0, 30).map((v, i) => ({
              '@type': 'ListItem',
              position: i + 1,
              name: v.title,
              url: abs(v.href),
            })),
          },
        },
      ],
    }),
  )
  record(page.slug, '0.9')

  writeFileSync(
    resolve(root, page.allSlug),
    shell({
      pageId: page.id,
      view: 'all',
      path: page.allSlug,
      entry: '/src/entries/product.jsx',
      title: `همه محصولات ${page.title} | ${site.name}`,
      description: `فهرست کامل تنوع‌های ${page.title} تولید نایلونیوم در عرض، ضخامت و رنگ‌های مختلف.`,
      graph: [
        organization,
        breadcrumbs([
          { name: 'خانه', path: '' },
          { name: page.title, path: page.slug },
          { name: 'همه محصولات', path: page.allSlug },
        ]),
      ],
    }),
  )
  record(page.allSlug, '0.7')
  familyCount += 2

  for (const variant of variants) {
    const specs = variant.specs.map((s) => `${s.k}: ${s.v}`).join('، ')
    const path = variantSlug(page.id, variant.id)

    writeFileSync(
      resolve(root, path),
      shell({
        pageId: page.id,
        view: 'variant',
        variantId: variant.id,
        depth: 1,
        path,
        entry: '/src/entries/product.jsx',
        title: `${variant.title} | ${page.title} — ${site.name}`,
        description: `${variant.title} — ${variant.short}. ${specs}. تولید نایلونیوم با امکان سفارش در ابعاد دلخواه.`,
        graph: [
          organization,
          breadcrumbs([
            { name: 'خانه', path: '' },
            { name: page.title, path: page.slug },
            { name: variant.title, path },
          ]),
          {
            '@type': 'Product',
            name: variant.title,
            description: `${variant.short} — ${variant.category}`,
            category: `${page.title} / ${variant.category}`,
            url: abs(path),
            brand: { '@type': 'Brand', name: site.name },
            manufacturer: { '@type': 'Organization', name: site.name },
            additionalProperty: variant.specs.map((s) => ({
              '@type': 'PropertyValue',
              name: s.k,
              value: s.v,
            })),
          },
        ],
      }),
    )
    record(path, '0.6')
    variantCount++
  }
}

// ── robots.txt and sitemap ────────────────────────────────────────────
const publicDir = resolve(root, 'public')
mkdirSync(publicDir, { recursive: true })

writeFileSync(
  resolve(publicDir, 'robots.txt'),
  `User-agent: *\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`,
)

const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  resolve(publicDir, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>\n    <loc>${abs(u.path)}</loc>\n    <lastmod>${today}</lastmod>\n    <priority>${u.priority}</priority>\n  </url>`,
  )
  .join('\n')}
</urlset>
`,
)

// The 404 is served from arbitrary URLs, so its links must be absolute.
const notFound = readFileSync(resolve(here, '404.template.html'), 'utf8')
writeFileSync(resolve(publicDir, '404.html'), notFound.replaceAll('{{SITE}}', siteUrl))

// ── Share card ────────────────────────────────────────────────────────
// Every conversation about this business starts with a link pasted into a
// chat, so the card is not decoration — it is the first thing most visitors
// see of the site. Rendered from src/data like everything else, so changing
// the tagline changes the card too.
writeFileSync(
  resolve(publicDir, 'og.png'),
  await renderOgCard(
    {
      // The Latin name, not the Persian one: it is the wordmark, and it reads
      // as a mark rather than as a line of text at this size.
      wordmark: site.nameLatin.toUpperCase(),
      tagline: site.tagline,
      families: productPages.map((p) => p.title.replace(/^نایلون /, '').replace(/ نایلون$/, '')),
      // Latin digits, and the leading zero kept — it is a phone number to be
      // read off and dialled, not a quantity.
      phone: phoneNumbers[0].raw.replace(/^\+98/, '0').replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3'),
    },
    root,
  ),
)

const rootPages = readdirSync(root).filter((f) => f.endsWith('.html')).length
console.log(
  `generated ${familyCount} root shells and ${variantCount} variant shells ` +
    `(${rootPages} html at root, ${variantCount} in product/), ` +
    `plus robots.txt and a sitemap of ${urls.length} URLs`,
)
