/* globals describe it expect */

import { colorIn, colorOut } from '../../../src/core/helpers/color'

describe('colorIn', () => {
  it('converts hex string to hex object', () => {
    expect(colorIn('#ffffff')).toMatchObject({ colorType: 'hex' })
  })

  it('converts rgb string to rgb object', () => {
    expect(colorIn('rgb(255,255,255)')).toMatchObject({ colorType: 'rgb' })
  })

  it('converts rgba string to rgba object', () => {
    expect(colorIn('rgba(255,255,255,1)')).toMatchObject({ colorType: 'rgba' })
  })

  it('does not convert unknown string', () => {
    expect(colorIn('white')).toMatchObject({ colorType: 'hex' })
  })

  it('accepts shorthand hex string', () => {
    expect(colorIn('#fff')).toMatchObject({ colorType: 'hex' })
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
    })).toEqual('#ffffff')
  })

  it('converts rgb object to rgb string', () => {
    expect(colorOut({
      middleware: 'color',
      colorType: 'rgb',
      r: 255,
      g: 255,
      b: 255,
      a: 1
    })).toEqual('rgb(255,255,255)')
  })

  it('converts rgba object to rgba string', () => {
    expect(colorOut({
      middleware: 'color',
      colorType: 'rgba',
      r: 255,
      g: 255,
      b: 255,
      a: 1
    })).toEqual('rgba(255,255,255,1)')
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

    expect(colorOut(input)).toEqual(input)
  })
})
