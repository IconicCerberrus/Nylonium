/**
 * Fades + lifts its children into place as they come into view.
 *
 * The whole effect is CSS — see `.reveal` in index.css. It used to be an
 * IntersectionObserver that started every block at `opacity: 0` and revealed
 * it on approach, which cannot survive prerendering: the markup ships with
 * the content already in it, so hiding it again in JavaScript would show the
 * page, blank half of it, then fade it back in.
 *
 * A scroll-driven animation has the property that matters here — the element
 * is visible by default and the animation only moves it — so a browser
 * without support, or a reader who asked for less motion, simply gets the
 * content. Nothing is ever hidden waiting for script to run.
 *
 * `y` is how far it travels. `delay` is accepted and ignored: the old stagger
 * existed because a whole row revealed on one observer callback, and a
 * view-driven timeline staggers on its own, each element animating as it
 * personally crosses the edge of the screen.
 */
export default function Reveal({
  as: Tag = 'div',
  // eslint-disable-next-line no-unused-vars -- swallowed on purpose, see above
  delay,
  y = 18,
  className = '',
  children,
  ...rest
}) {
  return (
    <Tag className={`reveal ${className}`} style={{ '--reveal-y': `${y}px` }} {...rest}>
      {children}
    </Tag>
  )
}
