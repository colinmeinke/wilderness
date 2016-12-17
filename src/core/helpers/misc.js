/**
 * Filter an object for desired keys.
 *
 * @param {array} keys - The desired keys.
 * @param {object} obj - The object to filter.
 *
 * @returns {object}
 *
 * @example
 * // returns { a: 1, b: 2 }
 * filter([ 'a', 'b' ], { a: 1, b: 2, c: 3 })
 */
const filter = (keys, obj) => {
  const filtered = {}

  keys.map(k => {
    const value = obj[ k ]

    if (typeof value !== 'undefined') {
      filtered[ k ] = value
    }
  })

  return filtered
}

export { filter }
