/* globals describe it expect */

import { colorIn, colorOut } from '../../../src/core/helpers/color'

describe('colorIn', () => {
  it('converts hex string to hex object', () => {
    const { colorType } = colorIn('#ffffff')
    expect(colorType).toBe('hex')
  })

  it('converts rgb string to rgb object', () => {
    const { colorType } = colorIn('rgb(255,255,255)')
    expect(colorType).toBe('rgb')
  })

  it('converts rgba string to rgba object', () => {
    const { colorType } = colorIn('rgba(255,255,255,1)')
    expect(colorType).toBe('rgba')
  })

  it('does not convert unknown string', () => {
    const input = 'white'
    expect(colorIn(input)).toBe(input)
  })

  it('accepts shorthand hex string', () => {
    const { colorType } = colorIn('#fff')
    expect(colorType).toBe('hex')
  })
})

describe('colorOut', () => {
  it('converts hex object to hex string', () => {
    expect(colorOut({
      middleware: 'color',
      colorType: 'hex',
      r: 255,
      g: 255,
      b: 255,
      a: 1
    })).toBe('#ffffff')
  })

  it('converts rgb object to rgb string', () => {
    expect(colorOut({
      middleware: 'color',
      colorType: 'rgb',
      r: 255,
      g: 255,
      b: 255,
      a: 1
    })).toBe('rgb(255,255,255)')
  })

  it('converts rgba object to rgba string', () => {
    expect(colorOut({
      middleware: 'color',
      colorType: 'rgba',
      r: 255,
      g: 255,
      b: 255,
      a: 1
    })).toBe('rgba(255,255,255,1)')
  })

  it('does not convert other middleware', () => {
    const input = {
      middleware: 'other',
      colorType: 'rgba',
      r: 255,
      g: 255,
      b: 255,
      a: 1
    }

    expect(colorOut(input)).toBe(input)
  })
})
