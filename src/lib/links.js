/**
 * Link helpers for the multi-page build.
 *
 * Only the landing page leaves `data-page` off the root element, which is how
 * we tell where we are. On the landing page an in-page hash scrolls smoothly;
 * from a product page the same target has to name the file first, otherwise
 * the browser looks for a section that is not there.
 */
import { isBrowser } from './browser.js'

/**
 * Where the page being rendered sits, for the build-time pass.
 *
 * In the browser both facts are read off `<html>`, which the shell has always
 * carried. Rendering in Node has no `<html>` to read, so the prerenderer says
 * which page it is about to render before it renders it. The values have to
 * agree between the two passes or every link in the static markup would
 * differ from the one React builds on hydration.
 *
 * Module-level rather than context because prerendering is sequential — one
 * page is rendered to a string at a time — and threading a provider through
 * every page component to carry two strings would be worse.
 */
let building = { root: '', home: false }

/** Called by the prerenderer before each page. No effect in the browser. */
export function setPageContext({ root: r = '', home = false } = {}) {
  building = { root: r, home }
}

/**
 * Only index.html carries `data-home`. Testing for it beats inferring from a
 * missing product id — the contact page has no product either, and inferring
 * left its in-page anchors pointing at sections it does not contain.
 */
const onHome = () =>
  isBrowser ? document.documentElement.dataset.home !== undefined : building.home

/**
 * Prefix that walks back up to the project root.
 *
 * Variant pages live one directory down, and every shell declares its own
 * depth on the root element, so a link built here is correct from any page
 * without the components needing to know where they are.
 */
export function root() {
  return isBrowser ? (document.documentElement.dataset.root ?? '') : building.root
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
