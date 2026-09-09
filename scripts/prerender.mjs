/**
 * Renders every page into its built shell.
 *
 * Until this ran, all 147 files shipped an empty `<div id="root">` and the
 * text of the site existed only after a visitor's browser had downloaded and
 * executed the bundle. Now the markup is in the file, so the page is readable
 * on arrival and a crawler that does not run JavaScript sees the products.
 *
 * Runs after `vite build`, over `dist/` — the shells there already carry the
 * hashed script and stylesheet tags, so this only fills in the body.
 *
 * The page list is derived from the same data as the shells themselves, so a
 * product added to `src/data` is prerendered without touching this file.
 */
import { createElement as h } from 'react'
import { renderToString } from 'react-dom/server'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createServer } from 'vite'

const here = dirname(fileURLToPath(import.meta.url))
const dist = resolve(here, '../dist')

// Vite's SSR loader, because the pages are JSX and import CSS — neither of
// which plain Node will take.
const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

const load = async (p) => (await server.ssrLoadModule(p)).default
const loadAll = (p) => server.ssrLoadModule(p)

try {
  const { setPageContext } = await loadAll('/src/lib/links.js')
  const Provider = await load('/src/context/ContactDialog.jsx')
  const HomePage = await load('/src/pages/HomePage.jsx')
  const ContactPage = await load('/src/pages/ContactPage.jsx')
  const FamilyPage = await load('/src/pages/FamilyPage.jsx')
  const AllProductsPage = await load('/src/pages/AllProductsPage.jsx')
  const VariantPage = await load('/src/pages/VariantPage.jsx')
  const { productPages } = await loadAll('/src/data/families/all.js')
  const { allVariants, findVariant, variantSlug } = await loadAll('/src/data/pages.js')

  // HomePage mounts its own provider; every other page gets it from its entry,
  // so the tree rendered here has to match the entry exactly or hydration
  // would find a different shape than it was given.
  const wrap = (el) => h(Provider, null, el)

  const pages = [
    { file: 'index.html', root: '', home: true, el: () => h(HomePage) },
    { file: 'contact.html', root: '', el: () => wrap(h(ContactPage)) },
  ]

  for (const page of productPages) {
    pages.push({ file: page.slug, root: '', el: () => wrap(h(FamilyPage, { page })) })
    pages.push({ file: page.allSlug, root: '', el: () => wrap(h(AllProductsPage, { page })) })

    for (const item of allVariants(page)) {
      const variant = findVariant(page, item.id)
      pages.push({
        file: variantSlug(page.id, item.id),
        // Variant pages sit one directory down, and links.js has no <html> to
        // read that from when it is not in a browser.
        root: '../',
        el: () => wrap(h(VariantPage, { page, variant })),
      })
    }
  }

  const EMPTY = '<div id="root"></div>'
  let done = 0
  let bytes = 0

  for (const { file, root, home = false, el } of pages) {
    const path = resolve(dist, file)
    const shell = readFileSync(path, 'utf8')

    if (!shell.includes(EMPTY)) {
      throw new Error(`${file}: no empty root div to fill — has the shell template changed?`)
    }

    setPageContext({ root, home })
    const html = renderToString(el())

    writeFileSync(path, shell.replace(EMPTY, `<div id="root">${html}</div>`))
    done++
    bytes += html.length
  }

  await server.close()
  console.log(
    `prerendered ${done} pages, ${(bytes / 1024 / 1024).toFixed(1)} MB of markup ` +
      `(${Math.round(bytes / done / 1024)} KB average)`,
  )
} catch (error) {
  await server.close()
  console.error('prerender failed:', error.message)
  process.exit(1)
}
