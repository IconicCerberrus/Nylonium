import tagheei from './tagheei.js'
import greenhouse from './greenhouse.js'
import shrink from './shrink.js'
import bags from './bags.js'
import stretch from './stretch.js'

/**
 * Every family, imported eagerly.
 *
 * Only the page generator and other build-time tooling should use this. The
 * browser goes through loadFamily() instead, which fetches one family's data
 * rather than all five.
 */
export const productPages = [tagheei, greenhouse, shrink, bags, stretch]
