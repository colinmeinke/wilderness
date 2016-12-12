/* globals describe it expect */

import { currentIteration } from '../../../src/core/helpers/animation'

describe('currentIteration', () => {
  it('rounds floats up', () => {
    expect(currentIteration(2.1)).toEqual(3)
  })

  it('returns integers unchanged', () => {
    expect(currentIteration(1)).toEqual(1)
  })

  it('returns a minimum of 1', () => {
    expect(currentIteration(0)).toEqual(1)
  })
})
