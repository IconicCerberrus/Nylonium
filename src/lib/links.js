/**
 * Link helpers for the multi-page build.
 *
 * Only the landing page leaves `data-page` off the root element, which is how
 * we tell where we are. On the landing page an in-page hash scrolls smoothly;
 * from a product page the same target has to name the file first, otherwise
 * the browser looks for a section that is not there.
 */
const onHome = () => !document.documentElement.dataset.page

/**
 * Prefix that walks back up to the project root.
 *
 * Variant pages live one directory down, and every shell declares its own
 * depth on the root element, so a link built here is correct from any page
 * without the components needing to know where they are.
 */
export function root() {
  return document.documentElement.dataset.root ?? ''
}

/** A page at the project root, addressed correctly from anywhere. */
export function page(file) {
  return `${root()}${file}`
}

/** A section of the landing page, addressed correctly from anywhere. */
export function home(hash = '') {
  if (onHome()) return hash || '#top'
  return `${root()}index.html${hash}`
}
