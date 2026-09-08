/**
 * Builders shared by the family data modules. Keeping a variant on one line
 * makes a category of nine readable at a glance.
 */

/** v(id, title, short, ...specs) */
export const v = (id, title, short, ...specs) => ({ id, title, short, specs })

/** Spec pair: s('عرض', 'تا ۱۲ متر') */
export const s = (k, val) => ({ k, v: val })
