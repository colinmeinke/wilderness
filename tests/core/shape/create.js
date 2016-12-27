/* globals describe it expect */

import { addDurations } from '../../../src/core/shape/create'

describe('addDurations', () => {
  it('adds all keyframe durations', () => {
    const keyframes = [
      {},
      { animation: { duration: 200 } },
      { animation: { duration: 500 } },
      { animation: { duration: 300 } }
    ]

    expect(addDurations(keyframes)).toBe(1000)
  })
})
