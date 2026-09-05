/**
 * Link helpers for the multi-page build.
 *
 * Only the landing page leaves `data-page` off the root element, which is how
 * we tell where we are. On the landing page an in-page hash scrolls smoothly;
 * from a product page the same target has to name the file first, otherwise
 * the browser looks for a section that is not there.
 */
const onHome = () => !document.documentElement.dataset.page

/** A section of the landing page, addressed correctly from anywhere. */
export function home(hash = '') {
  if (onHome()) return hash || '#top'
  return `index.html${hash}`
}
