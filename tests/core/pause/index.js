/* globals describe it expect */

import pause from '../../../src/core/pause'

describe('pause', () => {
  it('should pause the animation', () => {
    const now = 1
    const playable = { now, state: { animation: {} } }

    pause(playable)

    expect(playable.state.animation.pause).toBe(now)
  })

  it('should not pause an already paused animation', () => {
    const timePaused = 500
    const now = 750
    const playable = { now, state: { animation: { pause: timePaused } } }

    pause(playable)

    expect(playable.state.animation.pause).toBe(timePaused)
  })
})
