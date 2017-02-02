/* globals describe it expect */

import {
  animationState,
  currentKeyframes,
  shapeAttributes,
  styleAttributes
} from '../../../src/core/shape/state'

describe('animationState', () => {
  it('returns default state when no animation', () => {
    const shape = {
      timeline: {
        keyframes: [ {} ],
        timing: [ 0 ]
      }
    }

    const state = {
      currentProgress: 0,
      currentReverse: false,
      iterationsComplete: 0,
      keyframe1: {},
      keyframe1Index: 0
    }

    expect(animationState(shape)).toEqual(state)
  })

  it('returns correct state with simple animation', () => {
    const shape = {
      state: {
        animation: {
          alternate: false,
          currentProgress: 0,
          currentReverse: false,
          duration: 1000,
          finished: false,
          initialProgress: 0,
          iterations: 3,
          iterationsComplete: 0,
          now: 1500,
          play: 0,
          reverse: false,
          started: true
        }
      },
      timeline: {
        keyframes: [ { a: 1 }, { b: 2 } ],
        timing: [ 0, 1 ]
      }
    }

    const state = {
      alternate: false,
      currentProgress: 0.5,
      currentReverse: false,
      duration: 1000,
      finished: false,
      initialProgress: 0,
      iterations: 3,
      iterationsComplete: 1.5,
      keyframe1: { a: 1 },
      keyframe1Index: 0,
      keyframe2: { b: 2 },
      keyframe2Index: 1,
      now: 1500,
      play: 0,
      reverse: false,
      started: true
    }

    expect(animationState(shape)).toEqual(state)
  })
})

describe('currentKeyframes', () => {
  it('does not return keyframe2 and keyframe2Index when passed a single keyframe', () => {
    const currentProgress = 0
    const keyframes = [ {} ]
    const timing = [ 0 ]

    const result = {
      keyframe1: {},
      keyframe1Index: 0
    }

    expect(currentKeyframes({ currentProgress, keyframes, timing }))
      .toEqual(result)
  })

  it('returns correct keyframes when only two keyframes', () => {
    const currentProgress = 0.5
    const keyframes = [ { a: 1 }, { b: 2 } ]
    const timing = [ 0, 1 ]

    const result = {
      keyframe1: { a: 1 },
      keyframe1Index: 0,
      keyframe2: { b: 2 },
      keyframe2Index: 1
    }

    expect(currentKeyframes({ currentProgress, keyframes, timing }))
      .toEqual(result)
  })

  it('returns correct keyframes when more than two keyframes', () => {
    const currentProgress = 0.75
    const keyframes = [ { a: 1 }, { b: 2 }, { c: 3 } ]
    const timing = [ 0, 0.5, 1 ]

    const result = {
      keyframe1: { b: 2 },
      keyframe1Index: 1,
      keyframe2: { c: 3 },
      keyframe2Index: 2
    }

    expect(currentKeyframes({ currentProgress, keyframes, timing }))
      .toEqual(result)
  })

  it('returns correct keyframes when currentProgress matches a timing item', () => {
    const currentProgress = 0.5
    const keyframes = [ { a: 1 }, { b: 2 }, { c: 3 } ]
    const timing = [ 0, 0.5, 1 ]

    const result = {
      keyframe1: { a: 1 },
      keyframe1Index: 0,
      keyframe2: { b: 2 },
      keyframe2Index: 1
    }

    expect(currentKeyframes({ currentProgress, keyframes, timing }))
      .toEqual(result)
  })
})

describe('shapeAttributes', () => {
  it('converts shape to attributes', () => {
    const shape = {
      points: [
        { x: 0, y: 0, moveTo: true },
        { x: 50, y: 50 }
      ],
      styles: {
        fill: '#FFF'
      }
    }

    const attributes = {
      d: 'M0,0L50,50',
      fill: '#FFF'
    }

    expect(shapeAttributes(shape)).toEqual(attributes)
  })
})

describe('styleAttributes', () => {
  it('converts styles to attributes', () => {
    const styles = {
      fill: '#FFF',
      fillOpacity: 0.5,
      fillRule: 'evenodd',
      stroke: '#000',
      strokeDasharray: '5, 5',
      strokeDashoffset: 100,
      strokeLinecap: 'round',
      strokeLinejoin: 'round',
      strokeOpacity: 1,
      strokeWidth: 2,
      vectorEffect: 'non-scaling-shape'
    }

    const attributes = {
      'fill': '#FFF',
      'fill-opacity': 0.5,
      'fill-rule': 'evenodd',
      'stroke': '#000',
      'stroke-dasharray': '5, 5',
      'stroke-dashoffset': 100,
      'stroke-linecap': 'round',
      'stroke-linejoin': 'round',
      'stroke-opacity': 1,
      'stroke-width': 2,
      'vector-effect': 'non-scaling-shape'
    }

    expect(styleAttributes(styles)).toEqual(attributes)
  })

  it('filters out unrecognised keys', () => {
    const props = {
      fill: '#FFF',
      foo: 'bar'
    }

    const attributes = {
      fill: '#FFF'
    }

    expect(styleAttributes(props)).toEqual(attributes)
  })
})
