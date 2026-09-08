/**
 * Helpers for the product family pages.
 *
 * The catalogues themselves live one per module under families/, and are
 * fetched on demand — see families/index.js. Only pure functions live here so
 * that importing them never drags a catalogue into the bundle.
 */

/**
 * Where a variant's own page lives. They sit in their own directory so the
 * project root does not fill up with a hundred-odd generated shells.
 */
export const variantSlug = (pageId, variantId) => `product/${pageId}-${variantId}.html`

/** Flat list of every variant on a page, each carrying its context and link. */
export const allVariants = (page) =>
  page.categories.flatMap((c) =>
    c.items.map((item) => ({
      ...item,
      category: c.title,
      categoryId: c.id,
      glyph: c.glyph,
      href: variantSlug(page.id, item.id),
    })),
  )

/** One variant plus the category it belongs to, for its own page. */
export function findVariant(page, variantId) {
  for (const category of page.categories) {
    const item = category.items.find((i) => i.id === variantId)
    if (item) return { ...item, category, glyph: category.glyph }
  }
  return null
}
