/**
 * Calls a function on each item from two sets of data.
 *
 * @param a - The first set of data.
 * @param b - The second set of data. Must be of an identicle structure to a.
 * @param {function} func - The function to call on the data.
 *
 * @example
 * // returns 3
 * match(1, 2, (a, b) => a + b)
 *
 * @example
 * // returns [ 4, 6 ]
 * match([ 1, 2 ], [ 3, 4 ], (a, b) => a + b)
 */
const match = (a, b, func) => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.map((item, i) => match(item, b[ i ], func))
  } else if (a && b && typeof a === 'object' && typeof b === 'object') {
    const result = {}

    Object.keys(a).map(k => {
      result[ k ] = match(a[ k ], b[ k ], func)
    })

    return result
  }

  return func(a, b)
}

export default match
