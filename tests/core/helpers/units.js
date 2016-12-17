/* globals describe it expect */

import { unitsIn, unitsOut } from '../../../src/core/helpers/units'

describe('unitsIn', () => {
  it('converts single unit string to unit object with one value', () => {
    const { values } = unitsIn('20px')
    expect(values).toEqual([[ 20, 'px' ]])
  })

  it('converts multi unit string to unit object with mutliple values', () => {
    const { values } = unitsIn('20px 100vw 50% 2.5rem')
    expect(values).toEqual([[ 20, 'px' ], [ 100, 'vw' ], [ 50, '%' ], [ 2.5, 'rem' ]])
  })

  it('does not convert unknown string', () => {
    expect(unitsIn('15feet')).toBe('15feet')
  })
})

describe('unitsOut', () => {
  it('converts unit object to unit string', () => {
    expect(unitsOut({
      middleware: 'units',
      values: [[ 20, 'px' ]]
    })).toBe('20px')
  })

  it('converts multi unit object to unit string', () => {
    expect(unitsOut({
      middleware: 'units',
      values: [
        [ 20, 'px' ],
        [ 100, 'vw' ],
        [ 50, '%' ],
        [ 2.5, 'rem' ]
      ]
    })).toBe('20px 100vw 50% 2.5rem')
  })

  it('does not convert other middleware', () => {
    const input = {
      middleware: 'other',
      values: [[ 20, 'px' ]]
    }

    expect(unitsOut(input)).toBe(input)
  })
})
