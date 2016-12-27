import { colorIn, colorOut } from './color'
import match from './match'
import { unitsIn, unitsOut } from './units'

/** Middleware to apply to tweened values */
const middleware = [
  { name: 'color', i: colorIn, o: colorOut },
  { name: 'units', i: unitsIn, o: unitsOut }
]

/**
 * Find current shape given a from shape, a to shape and tween data.
 *
 * @param {Object} fromShape - The shape object to tween from.
 * @param {Object} toShape - The shape object to tween to.
 * @param {number} time - Current time in milliseconds since the start of the tween.
 * @param {number} duration - Total duration of the tween in milliseconds.
 * @param {function} easing - The easing function.
 *
 * @returns {Object}
 *
 * @example
 * func(circle, square, 100, 200, easeInOutQuad)
 */
export default (fromShape, toShape, time, duration, easing) => {
  /**
   * Find current value given a from value and a to value and the
   * enclosed tween data.
   *
   * @param {(number|string)} from - The value to tween from.
   * @param {(number|string)} to - The value to tween to.
   *
   * @returns {(number|string)}
   *
   * @example
   * tween(1, 2)
   */
  const tween = (from, to) => {
    if (from === to) {
      return from
    }

    if (typeof from === 'number' && typeof to === 'number') {
      return easing(time, from, to, duration)
    }

    let f = from
    let t = to

    middleware.map(({ i }) => {
      if (typeof f === 'string' && typeof t === 'string') {
        f = i(f)
        t = i(t)
      }
    })

    if (typeof f === 'object' && typeof t === 'object') {
      for (let i in middleware) {
        const { name, o } = middleware[ i ]

        if (name === f.middleware && name === t.middleware) {
          return o(match(f, t, tween))
        }
      }
    }

    return from
  }

  return match(fromShape, toShape, tween)
}
