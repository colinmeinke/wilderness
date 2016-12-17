/**
 * Converts a color string to a color object.
 *
 * @param {string} str - A potential color string.
 *
 * @returns {(object|string)}
 *
 * @example
 * colorIn('#FFFFFF')
 */
const colorIn = str => {
  if (isHexStr(str)) {
    return hexToObj(str)
  } else if (isRgbStr(str)) {
    return rgbToObj(str)
  } else if (isRgbaStr(str)) {
    return rgbaToObj(str)
  }

  return str
}

/**
 * Converts a color object to a color string.
 *
 * @param {object} obj - A potential color object.
 * @param {string} obj.middleware - The middleware identifier.
 * @param {string} obj.colorType - The color type.
 *
 * @returns {(object|string)}
 *
 * @example
 * colorOut(obj)
 */
const colorOut = obj => {
  const { colorType, middleware } = obj

  if (middleware === 'color') {
    switch (colorType) {
      case 'rgba':
        return objToRgba(obj)
      case 'rgb':
        return objToRgb(obj)
      case 'hex':
        return objToHex(obj)
    }
  }

  return obj
}

/**
 * Converts a hex string to a color object.
 *
 * @param {string} str - A hex color string.
 *
 * @returns {object}
 *
 * @example
 * hexToObj('#FFFFFF')
 */
const hexToObj = str => {
  let hex = str.replace('#', '')

  if (hex.length === 3) {
    hex = hex.split('').map(v => `${v}${v}`).join('')
  }

  return {
    middleware: 'color',
    colorType: 'hex',
    r: parseInt(hex.slice(0, 2), 16),
    g: parseInt(hex.slice(2, 4), 16),
    b: parseInt(hex.slice(4, 6), 16),
    a: 1
  }
}

/**
 * Is string a hex color string?
 *
 * @param {string} str - A potential hex color string.
 *
 * @returns {boolean}
 *
 * @example
 * // returns true
 * isHexString('#FFFFFF')
 */
const isHexStr = str => str.match(/^#(?:[0-9a-f]{3}){1,2}$/i) !== null

/**
 * Is string a rgba color string?
 *
 * @param {string} str - A potential rgba color string.
 *
 * @returns {boolean}
 *
 * @example
 * // returns true
 * isRgbaStr('rgba(255,255,255,1)')
 */
const isRgbaStr = str => str.startsWith('rgba(')

/**
 * Is string a rgb color string?
 *
 * @param {string} str - A potential rgb color string.
 *
 * @returns {boolean}
 *
 * @example
 * // returns true
 * isRgbStr('rgb(255,255,255)')
 */
const isRgbStr = str => str.startsWith('rgb(')

/**
 * Find the closest number within limits.
 *
 * @param {number} num - The desired number.
 * @param {number} min - The minimum returned number.
 * @param {number} max - the maximum returned number.
 *
 * @returns {number}
 *
 * @example
 * // returns 2
 * limit(-1, 2, 5)
 */
const limit = (num, min, max) => Math.max(min, Math.min(max, num))

/**
 * Converts a color object to a hex string.
 *
 * @param {object} obj - A color object.
 * @param {integer} obj.r - The red value.
 * @param {integer} obj.g - The green value.
 * @param {integer} obj.b - The blue value.
 *
 * @returns {string}
 *
 * @example
 * objToHex(obj)
 */
const objToHex = obj => {
  let r = Math.ceil(limit(obj.r, 0, 255)).toString(16)
  let g = Math.ceil(limit(obj.g, 0, 255)).toString(16)
  let b = Math.ceil(limit(obj.b, 0, 255)).toString(16)

  r = r.length === 1 ? `0${r}` : r
  g = g.length === 1 ? `0${g}` : g
  b = b.length === 1 ? `0${b}` : b

  return `#${r}${g}${b}`
}

/**
 * Converts a color object to a rgba string.
 *
 * @param {object} obj - A color object.
 * @param {integer} obj.r - The red value.
 * @param {integer} obj.g - The green value.
 * @param {integer} obj.b - The blue value.
 * @param {float} obj.a - The alpha value.
 *
 * @returns {string}
 *
 * @example
 * objToRgba(obj)
 */
const objToRgba = ({ r, g, b, a }) => `rgba(${limit(r, 0, 255)},${limit(g, 0, 255)},${limit(b, 0, 255)},${limit(a, 0, 1)})`

/**
 * Converts a color object to a rgb string.
 *
 * @param {object} obj - A color object.
 * @param {integer} obj.r - The red value.
 * @param {integer} obj.g - The green value.
 * @param {integer} obj.b - The blue value.
 *
 * @returns {string}
 *
 * @example
 * objToRgb(obj)
 */
const objToRgb = ({ r, g, b }) => `rgb(${limit(r, 0, 255)},${limit(g, 0, 255)},${limit(b, 0, 255)})`

/**
 * Converts an rgba string to a color object.
 *
 * @param {string} str - An rgba color string.
 *
 * @returns {object}
 *
 * @example
 * rgbaToObj('rgba(255,255,255,1)')
 */
const rgbaToObj = str => {
  const rgba = str.replace(/\s/g, '')

  const [ r, g, b, a ] = rgba.substring(5, rgba.length - 1).split(',')

  return {
    middleware: 'color',
    colorType: 'rgba',
    r: parseFloat(r),
    g: parseFloat(g),
    b: parseFloat(b),
    a: parseFloat(a)
  }
}

/**
 * Converts an rgb string to a color object.
 *
 * @param {string} str - An rgb color string.
 *
 * @returns {object}
 *
 * @example
 * rgbToObj('rgb(255,255,255)')
 */
const rgbToObj = str => {
  const rgb = str.replace(/\s/g, '')

  const [ r, g, b ] = rgb.substring(4, rgb.length - 1).split(',')

  return {
    middleware: 'color',
    colorType: 'rgb',
    r: parseFloat(r),
    g: parseFloat(g),
    b: parseFloat(b),
    a: 1
  }
}

export { colorIn, colorOut }
