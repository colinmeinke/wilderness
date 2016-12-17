/* globals describe it expect */

import { filter } from '../../../src/core/helpers/misc'

describe('filter', () => {
  it('returns an object with desired keys', () => {
    expect(filter([ 'a', 'b' ], { a: 1, b: 2, c: 3 })).toEqual({ a: 1, b: 2 })
  })

  it('does not add key to returned object if it does not exist', () => {
    expect(filter([ 'a', 'b' ], { a: 1, c: 3 })).toEqual({ a: 1 })
  })
})
