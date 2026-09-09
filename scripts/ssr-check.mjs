/**
 * Renders every kind of page in Node and fails if any of them throws.
 *
 * The point is not the markup — it is that nothing reaches for `document` or
 * `window` while rendering. That is the one thing standing between this
 * codebase and a static prerender, and it is the kind of breakage that
 * reappears the moment someone adds a component without thinking about it,
 * so it is checked rather than remembered.
 *
 * Run through Vite's SSR module loader because the pages are JSX and import
 * CSS; plain Node can do neither.
 */
import { createServer } from 'vite'
import { renderToString } from 'react-dom/server'
import { createElement as h } from 'react'

const server = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
  logLevel: 'error',
})

const load = (p) => server.ssrLoadModule(p)

try {
  const { setPageContext } = await load('/src/lib/links.js')
  const { default: ContactDialogProvider } = await load('/src/context/ContactDialog.jsx')
  const { default: HomePage } = await load('/src/pages/HomePage.jsx')
  const { default: ContactPage } = await load('/src/pages/ContactPage.jsx')
  const { default: FamilyPage } = await load('/src/pages/FamilyPage.jsx')
  const { default: AllProductsPage } = await load('/src/pages/AllProductsPage.jsx')
  const { default: VariantPage } = await load('/src/pages/VariantPage.jsx')
  const { productPages } = await load('/src/data/families/all.js')
  const { findVariant } = await load('/src/data/pages.js')

  const family = productPages[0]
  const variant = findVariant(family, family.categories[0].items[0].id)

  // HomePage brings its own provider; the others are mounted by the entry.
  const wrap = (el) => h(ContactDialogProvider, null, el)

  const cases = [
    ['landing', { root: '', home: true }, () => h(HomePage)],
    ['contact', { root: '', home: false }, () => wrap(h(ContactPage))],
    ['family', { root: '', home: false }, () => wrap(h(FamilyPage, { page: family }))],
    ['all', { root: '', home: false }, () => wrap(h(AllProductsPage, { page: family }))],
    ['variant', { root: '../', home: false }, () => wrap(h(VariantPage, { page: family, variant }))],
  ]

  let failed = 0

  for (const [name, ctx, build] of cases) {
    setPageContext(ctx)
    try {
      const html = renderToString(build())
      const ok = html.length > 500
      console.log(`  ${ok ? 'ok  ' : 'thin'} ${name.padEnd(8)} ${html.length} chars`)
      if (!ok) failed++
    } catch (error) {
      failed++
      console.error(`  FAIL ${name.padEnd(8)} ${error.message}`)
    }
  }

  /*
   * Every internal link on a variant page has to carry the ../ prefix.
   *
   * This is not hypothetical. The navbar rendered the hrefs from navLinks
   * raw — they are written relative to the project root — so from product/
   * they resolved to product/tagheei.html and 404'd, on all 135 variant
   * pages, for as long as those pages have existed. A link audit that only
   * asks "does the target exist" passes that happily, because the target
   * does exist; it has to resolve the URL against the page it was rendered
   * on, which is what this does.
   */
  setPageContext({ root: '../', home: false })
  const variantHtml = renderToString(wrap(h(VariantPage, { page: family, variant })))

  const internal = [...variantHtml.matchAll(/href="([^"]+)"/g)]
    .map((m) => m[1])
    .filter((href) => !/^(#|\.\.\/|https?:|tel:|mailto:)/.test(href))

  if (internal.length) {
    failed++
    console.error(
      `  FAIL links    ${internal.length} link(s) on the variant page are missing their ../ prefix:`,
    )
    for (const href of [...new Set(internal)].slice(0, 8)) console.error(`         ${href}`)
  } else {
    console.log('  ok   links    every internal link on the variant page resolves through ../')
  }

  await server.close()

  if (failed) {
    console.error(`\n${failed} check(s) failed`)
    process.exit(1)
  }
  console.log('\nevery page renders in Node')
} catch (error) {
  await server.close()
  console.error(error)
  process.exit(1)
}
