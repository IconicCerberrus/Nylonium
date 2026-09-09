/**
 * Whether this module is running in a browser.
 *
 * The site is rendered twice: once in Node at build time, to put real markup
 * in every shell, and again in the visitor's browser to make it interactive.
 * Effects never run during the first pass, so most browser code needs no
 * guard at all — only the handful of places that touch `document` or `window`
 * while *rendering* do, and they import this.
 *
 * Read once at module load. It cannot change for the life of a process, and
 * a constant keeps it out of render paths.
 */
export const isBrowser = typeof document !== 'undefined' && typeof window !== 'undefined'
