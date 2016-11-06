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

const unitsIn = v => {
  const parts = v.split(' ')

  const values = parts.map(part => {
    const number = parseFloat(part)
    const unit = part.replace(number, '')

    if (!isNaN(number) && (unit === '' || units.indexOf(unit) !== -1)) {
      return [ number, unit ]
    }

    return part
  })

  return values.toString() === parts.toString()
    ? v
    : { middleware: 'units', values }
}

const unitsOut = v => {
  const { middleware, values } = v

  if (middleware === 'units') {
    return values.map(a => a.join('')).join(' ')
  }

  return v
}

export { unitsIn, unitsOut }
