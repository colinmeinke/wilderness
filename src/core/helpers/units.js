/** A list of unit types to parse with unit middleware */
const units = [
  'ch',
  'cm',
  'em',
  'ex',
  'in',
  'mm',
  'pc',
  'pt',
  'px',
  'rem',
  'vh',
  'vmax',
  'vmin',
  'vw',
  '%'
]

/**
 * Coverts a unit string to a unit object.
 *
 * @param {string} str - A potential unit string.
 *
 * @returns {(Object|string)}
 *
 * @example
 * unitsIn('20px')
 */
const unitsIn = str => {
  const parts = str.split(' ')

  const values = parts.map(part => {
    const number = parseFloat(part)
    const unit = part.replace(number, '')

    if (!isNaN(number) && (unit === '' || units.indexOf(unit) !== -1)) {
      return [ number, unit ]
    }

    return part
  })

  return values.toString() === parts.toString()
    ? str
    : { middleware: 'units', values }
}

/**
 * Coverts a unit object to a unit string.
 *
 * @param {Object} obj - A potential unit object.
 *
 * @returns {(Object|string)}
 *
 * @example
 * unitsOut(obj)
 */
const unitsOut = obj => {
  const { middleware, values } = obj

  if (middleware === 'units') {
    return values.map(a => a.join('')).join(' ')
  }

  return obj
}

export { unitsIn, unitsOut }
