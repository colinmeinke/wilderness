/* globals describe it expect */

import {
  currentIteration,
  currentReverse,
  currentState,
  easingFunc,
  finished,
  iterationsComplete,
  paused,
  previousIteration
} from '../../../src/core/helpers/animation'

describe('currentIteration', () => {
  it('rounds floats up', () => {
    expect(currentIteration(2.1)).toBe(3)
  })

  it('returns integers unchanged', () => {
    expect(currentIteration(1)).toBe(1)
  })

  it('returns a minimum of 1', () => {
    expect(currentIteration(0)).toBe(1)
  })
})

describe('currentReverse', () => {
  it('always matches initial reverse if not alternating', () => {
    expect(currentReverse({
      alternate: false,
      iteration: 3,
      reverse: true
    })).toBe(true)
  })

  it('matches initial reverse when alternating after odd iterations', () => {
    expect(currentReverse({
      alternate: true,
      iteration: 3,
      reverse: true
    })).toBe(true)
  })

  it('is opposite to initial reverse when alternating after even iterations', () => {
    expect(currentReverse({
      alternate: true,
      iteration: 4,
      reverse: true
    })).toBe(false)
  })
})

describe('currentState', () => {
  it('is initially not in reverse', () => {
    const { currentReverse } = currentState()
    expect(currentReverse).toBe(false)
  })

  it('is initially in reverse when initial reverse set to true', () => {
    const { currentReverse } = currentState({ reverse: true })
    expect(currentReverse).toBe(true)
  })

  it('matches initial reverse when alternating after odd iterations', () => {
    const { currentReverse } = currentState({
      alternate: true,
      duration: 100,
      iterations: 4,
      now: 250,
      play: 0,
      reverse: false,
      started: true
    })

    expect(currentReverse).toBe(false)
  })

  it('is opposite to initial reverse when alternating after even iterations', () => {
    const { currentReverse } = currentState({
      alternate: true,
      duration: 100,
      iterations: 4,
      now: 310,
      play: 0,
      reverse: false,
      started: true
    })

    expect(currentReverse).toBe(true)
  })

  it('initially has 0 current progress', () => {
    const { currentProgress } = currentState()
    expect(currentProgress).toBe(0)
  })

  it('calculates correct current progress during playback', () => {
    const { currentProgress } = currentState({
      duration: 100,
      iterations: 1,
      now: 20,
      play: 0,
      started: true
    })

    expect(currentProgress).toBe(0.2)
  })

  it('calculates correct current progress when initially in reverse', () => {
    const { currentProgress } = currentState({
      duration: 100,
      iterations: 1,
      now: 20,
      play: 0,
      reverse: true,
      started: true
    })

    expect(currentProgress).toBe(0.8)
  })

  it('calculates correct current progress when finished', () => {
    const { currentProgress } = currentState({
      duration: 100,
      iterations: 1,
      now: 120,
      play: 0,
      started: true
    })

    expect(currentProgress).toBe(1)
  })

  it('calculates correct current progress after multiple iterations', () => {
    const { currentProgress } = currentState({
      duration: 100,
      iterations: 4,
      now: 330,
      play: 0,
      started: true
    })

    expect(currentProgress).toBeCloseTo(0.3)
  })

  it('calculates correct current progress when alternating', () => {
    const { currentProgress } = currentState({
      alternate: true,
      duration: 100,
      iterations: 4,
      now: 330,
      play: 0,
      started: true
    })

    expect(currentProgress).toBeCloseTo(0.7)
  })

  it('calculates correct current progress when alternating and initial reverse', () => {
    const { currentProgress } = currentState({
      alternate: true,
      duration: 100,
      iterations: 4,
      now: 330,
      play: 0,
      reverse: true,
      started: true
    })

    expect(currentProgress).toBeCloseTo(0.3)
  })

  it('initially has 0 iterations complete', () => {
    const { iterationsComplete } = currentState()
    expect(iterationsComplete).toBe(0)
  })

  it('calculates correct iterations complete during playback', () => {
    const { iterationsComplete } = currentState({
      duration: 100,
      iterations: 1,
      now: 20,
      play: 0,
      started: true
    })

    expect(iterationsComplete).toBe(0.2)
  })

  it('calculates correct iterations complete after multiple iterations', () => {
    const { iterationsComplete } = currentState({
      alternate: true,
      duration: 100,
      iterations: 4,
      now: 350,
      play: 0,
      reverse: true,
      started: true
    })

    expect(iterationsComplete).toBe(3.5)
  })

  it('iterations complete does not exceed maximum iterations', () => {
    const { iterationsComplete } = currentState({
      alternate: true,
      duration: 100,
      iterations: 4,
      now: 1000,
      play: 0,
      reverse: true,
      started: true
    })

    expect(iterationsComplete).toBe(4)
  })
})

describe('easingFunc', () => {
  it('returns the input function', () => {
    const func = () => ({})
    expect(easingFunc(func)).toBe(func)
  })

  it('returns a function from a string', () => {
    expect(typeof easingFunc('easeInOutQuad')).toBe('function')
  })
})

describe('finished', () => {
  it('is false if within iterations', () => {
    expect(finished({
      duration: 100,
      iterations: 3,
      now: 210,
      play: 0
    })).toBe(false)
  })

  it('is true if exceeded iterations', () => {
    expect(finished({
      duration: 100,
      iterations: 1,
      now: 250,
      play: 0
    })).toBe(true)
  })

  it('is false if paused', () => {
    expect(finished({
      duration: 100,
      iterations: 1,
      now: 250,
      play: 0,
      pause: 50
    })).toBe(false)
  })
})

describe('iterationsComplete', () => {
  it('is 0 when no time played', () => {
    expect(iterationsComplete({
      duration: 100,
      iterations: 1,
      now: 0,
      play: 0
    })).toBe(0)
  })

  it('is correct during playback', () => {
    expect(iterationsComplete({
      duration: 100,
      iterations: 3,
      now: 250,
      play: 0
    })).toBe(2.5)
  })

  it('does not exceed total iterations', () => {
    expect(iterationsComplete({
      duration: 100,
      iterations: 1,
      now: 250,
      play: 0
    })).toBe(1)
  })
})

describe('paused', () => {
  it('is false if not passed pause timestamp', () => {
    expect(paused({})).toBe(false)
  })

  it('is true if passed pause timestamp', () => {
    expect(paused({ pause: Date.now() })).toBe(true)
  })
})

describe('previousIteration', () => {
  it('rounds down floats', () => {
    expect(previousIteration(3.2)).toBe(3)
  })

  it('is one less than integers', () => {
    expect(previousIteration(3)).toBe(2)
  })

  it('is never less than 0', () => {
    expect(previousIteration(0)).toBe(0)
  })
})
