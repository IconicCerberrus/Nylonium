/**
 * One dynamic import per family, written out explicitly so the bundler can
 * see each one and give it its own chunk. A product page then downloads only
 * the catalogue it is actually displaying.
 */
const loaders = {
  tagheei: () => import('./tagheei.js'),
  greenhouse: () => import('./greenhouse.js'),
  shrink: () => import('./shrink.js'),
  bags: () => import('./bags.js'),
  stretch: () => import('./stretch.js'),
}

export const familyIds = Object.keys(loaders)

export async function loadFamily(id) {
  const load = loaders[id]
  if (!load) return null
  const mod = await load()
  return mod.default
}
