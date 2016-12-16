/* globals describe it expect */

import match from '../../../src/core/helpers/match'

const add = (a, b) => a + b

describe('match', () => {
  it('applies function correctly to string data', () => {
    expect(match('foo', 'bar', add)).toBe('foobar')
  })

  it('applies function correctly to number data', () => {
    expect(match(1, 2, add)).toBe(3)
  })

  it('applies function correctly to array data', () => {
    expect(match([ 1, 2 ], [ 3, 4 ], add)).toEqual([ 4, 6 ])
  })

  it('applies function correctly to nested array data', () => {
    expect(match([ [ 1 ], [ [ 2 ], 3 ] ], [ [ 4 ], [ [ 5 ], 6 ] ], add))
      .toEqual([ [ 5 ], [ [ 7 ], 9 ] ])
  })

  it('applies function correctly to object data', () => {
    expect(match({ foo: 1 }, { foo: 2 }, add)).toEqual({ foo: 3 })
  })

  it('applies function correctly to nested object data', () => {
    expect(match({ a: { b: 1 }, c: { d: { e: 2 } } }, { a: { b: 3 }, c: { d: { e: 4 } } }, add))
      .toEqual({ a: { b: 4 }, c: { d: { e: 6 } } })
  })

  it('applies function correctly to nested mixed data', () => {
    expect(match({ foo: 1, bar: [ 2, 'a' ] }, { foo: 3, bar: [ 4, 'b' ] }, add))
      .toEqual({ foo: 4, bar: [ 6, 'ab' ] })
  })
})
