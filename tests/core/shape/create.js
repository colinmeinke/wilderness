/* globals describe it expect */

import create, {
  addDurations,
  keyframe,
  keyframeShape,
  manipulate,
  timing
} from '../../../src/core/shape/create'

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

describe('create', () => {
  it('handles single plain shape object', () => {
    const plainShapeObject = {
      type: 'circle',
      cx: 50,
      cy: 50,
      r: 20
    }

    const result = {
      timeline: {
        duration: 0,
        keyframes: [
          {
            shapes: [
              {
                points: [
                  { x: 50, y: 30, moveTo: true },
                  { x: 50, y: 70, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } },
                  { x: 50, y: 30, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } }
                ],
                styles: {}
              }
            ]
          }
        ],
        motionPaths: [ undefined ],
        timing: [ 0 ]
      }
    }

    expect(create([ plainShapeObject ])).toEqual(result)
  })

  it('handles multiple plain shape objects', () => {
    const plainShapeObjectA = {
      type: 'circle',
      cx: 50,
      cy: 50,
      r: 20
    }

    const plainShapeObjectB = {
      type: 'ellipse',
      cx: 100,
      cy: 300,
      rx: 65,
      ry: 120
    }

    const result = {
      timeline: {
        duration: 250,
        keyframes: [
          {
            shapes: [
              {
                points: [
                  { x: 50, y: 30, moveTo: true },
                  { x: 50, y: 70, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } },
                  { x: 50, y: 30, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } }
                ],
                styles: {}
              }
            ]
          },
          {
            animation: {
              delay: 0,
              duration: 250
            },
            shapes: [
              {
                points: [
                  { x: 100, y: 180, moveTo: true },
                  { x: 100, y: 420, curve: { type: 'arc', rx: 65, ry: 120, sweepFlag: 1 } },
                  { x: 100, y: 180, curve: { type: 'arc', rx: 65, ry: 120, sweepFlag: 1 } }
                ],
                styles: {}
              }
            ]
          }
        ],
        motionPaths: [ undefined, undefined ],
        timing: [ 0, 1 ]
      }
    }

    expect(create([ plainShapeObjectA, plainShapeObjectB ])).toEqual(result)
  })
})

describe('keyframe', () => {
  it('has a single shape', () => {
    const isFirstKeyframe = true

    const plainShapeObject = {
      type: 'circle',
      cx: 50,
      cy: 50,
      r: 20
    }

    const result = {
      shapes: [
        {
          points: [
            { x: 50, y: 30, moveTo: true },
            { x: 50, y: 70, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } },
            { x: 50, y: 30, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } }
          ],
          styles: {}
        }
      ]
    }

    expect(keyframe({ isFirstKeyframe, plainShapeObject })).toEqual(result)
  })

  it('has multiple shapes when passed group shape', () => {
    const isFirstKeyframe = true

    const plainShapeObject = {
      type: 'g',
      shapes: [
        { type: 'circle', cx: 50, cy: 50, r: 20 },
        { type: 'ellipse', cx: 100, cy: 300, rx: 65, ry: 120 }
      ],
      fill: '#FFF'
    }

    const result = {
      shapes: [
        {
          styles: { fill: '#FFF' }
        },
        {
          points: [
            { x: 50, y: 30, moveTo: true },
            { x: 50, y: 70, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } },
            { x: 50, y: 30, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } }
          ],
          styles: {}
        },
        {
          points: [
            { x: 100, y: 180, moveTo: true },
            { x: 100, y: 420, curve: { type: 'arc', rx: 65, ry: 120, sweepFlag: 1 } },
            { x: 100, y: 180, curve: { type: 'arc', rx: 65, ry: 120, sweepFlag: 1 } }
          ],
          styles: {}
        }
      ]
    }

    expect(keyframe({ isFirstKeyframe, plainShapeObject })).toEqual(result)
  })

  it('has default animation props if not the first keyframe', () => {
    const isFirstKeyframe = false

    const plainShapeObject = {
      type: 'circle',
      cx: 50,
      cy: 50,
      r: 20
    }

    const result = {
      animation: {
        delay: 0,
        duration: 250
      },
      shapes: [
        {
          points: [
            { x: 50, y: 30, moveTo: true },
            { x: 50, y: 70, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } },
            { x: 50, y: 30, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } }
          ],
          styles: {}
        }
      ]
    }

    expect(keyframe({ isFirstKeyframe, plainShapeObject })).toEqual(result)
  })

  it('filters animation props', () => {
    const start = () => { console.log('circle started') }

    const isFirstKeyframe = false

    const plainShapeObject = {
      type: 'circle',
      cx: 50,
      cy: 50,
      r: 20,
      delay: 200,
      duration: 1000,
      easing: 'easeInQuad',
      foo: 'bar',
      name: 'circle',
      start
    }

    const result = {
      animation: {
        delay: 200,
        duration: 1000,
        easing: 'easeInQuad',
        name: 'circle',
        start
      },
      shapes: [
        {
          points: [
            { x: 50, y: 30, moveTo: true },
            { x: 50, y: 70, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } },
            { x: 50, y: 30, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } }
          ],
          styles: {}
        }
      ]
    }

    expect(keyframe({ isFirstKeyframe, plainShapeObject })).toEqual(result)
  })
})

describe('keyframeShape', () => {
  it('calculates points', () => {
    const plainShapeObject = {
      type: 'circle',
      cx: 50,
      cy: 50,
      r: 20
    }

    const result = {
      points: [
        { x: 50, y: 30, moveTo: true },
        { x: 50, y: 70, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } },
        { x: 50, y: 30, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } }
      ],
      styles: {}
    }

    expect(keyframeShape(plainShapeObject)).toEqual(result)
  })

  it('filters style props', () => {
    const plainShapeObject = {
      type: 'circle',
      cx: 50,
      cy: 50,
      r: 20,
      fill: '#FFF',
      stroke: '#000',
      foo: 'bar'
    }

    const result = {
      points: [
        { x: 50, y: 30, moveTo: true },
        { x: 50, y: 70, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } },
        { x: 50, y: 30, curve: { type: 'arc', rx: 20, ry: 20, sweepFlag: 1 } }
      ],
      styles: {
        fill: '#FFF',
        stroke: '#000'
      }
    }

    expect(keyframeShape(plainShapeObject)).toEqual(result)
  })

  it('excludes points when passed group shape', () => {
    const plainShapeObject = {
      type: 'g',
      shapes: [
        { type: 'circle', cx: 50, cy: 50, r: 20 },
        { type: 'ellipse', cx: 100, cy: 300, rx: 65, ry: 120 }
      ],
      fill: '#FFF'
    }

    const result = { styles: { fill: '#FFF' } }

    expect(keyframeShape(plainShapeObject)).toEqual(result)
  })
})

describe('manipulate', () => {
  it('should change index point', () => {
    const manipulations = { moveIndex: 2 }

    const points = [
      { x: 0, y: 0, moveTo: true },
      { x: 50, y: 25 },
      { x: -10, y: -100 },
      { x: 40, y: 30 },
      { x: 20, y: 50 },
      { x: 0, y: 0 }
    ]

    const result = [
      { x: -10, y: -100, moveTo: true },
      { x: 40, y: 30 },
      { x: 20, y: 50 },
      { x: 0, y: 0 },
      { x: 50, y: 25 },
      { x: -10, y: -100 }
    ]

    expect(manipulate({ manipulations, points })).toEqual(result)
  })

  it('should offset points', () => {
    const manipulations = { offset: [ 10, -5 ] }

    const points = [
      { x: 0, y: 0, moveTo: true },
      { x: 50, y: 25 },
      { x: -10, y: -100 }
    ]

    const result = [
      { x: 10, y: -5, moveTo: true },
      { x: 60, y: 20 },
      { x: 0, y: -105 }
    ]

    expect(manipulate({ manipulations, points })).toEqual(result)
  })

  it('should reverse points', () => {
    const manipulations = { reverse: true }

    const points = [
      { x: 0, y: 0, moveTo: true },
      { x: 50, y: 25 },
      { x: -10, y: -100 }
    ]

    const result = [
      { x: -10, y: -100, moveTo: true },
      { x: 50, y: 25 },
      { x: 0, y: 0 }
    ]

    expect(manipulate({ manipulations, points })).toEqual(result)
  })

  it('should rotate points', () => {
    const manipulations = { rotate: 90 }

    const points = [
      { x: 0, y: 0, moveTo: true },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 }
    ]

    const result = [
      { x: 100, y: 0, moveTo: true },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 },
      { x: 100, y: 0 }
    ]

    expect(manipulate({ manipulations, points })).toEqual(result)
  })

  it('should scale points', () => {
    const manipulations = { scale: 2 }

    const points = [
      { x: 0, y: 0, moveTo: true },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 }
    ]

    const result = [
      { x: -50, y: -50, moveTo: true },
      { x: 150, y: -50 },
      { x: 150, y: 150 },
      { x: -50, y: 150 },
      { x: -50, y: -50 }
    ]

    expect(manipulate({ manipulations, points })).toEqual(result)
  })

  it('should scale points from top left', () => {
    const manipulations = { scale: [ 2, 'topLeft' ] }

    const points = [
      { x: 0, y: 0, moveTo: true },
      { x: 100, y: 0 },
      { x: 100, y: 100 },
      { x: 0, y: 100 },
      { x: 0, y: 0 }
    ]

    const result = [
      { x: 0, y: 0, moveTo: true },
      { x: 200, y: 0 },
      { x: 200, y: 200 },
      { x: 0, y: 200 },
      { x: 0, y: 0 }
    ]

    expect(manipulate({ manipulations, points })).toEqual(result)
  })

  it('should apply multiple manipulations', () => {
    const manipulations = { offset: [ 10, -5 ], moveIndex: 1 }

    const points = [
      { x: 0, y: 0, moveTo: true },
      { x: 50, y: 25 },
      { x: -10, y: -100 }
    ]

    const result = [
      { x: 60, y: 20, moveTo: true },
      { x: 0, y: -105 },
      { x: 10, y: -5, moveTo: true },
      { x: 60, y: 20 }
    ]

    expect(manipulate({ manipulations, points })).toEqual(result)
  })
})

describe('timing', () => {
  it('has a single item when passed a single keyframe', () => {
    const duration = 1000
    const keyframes = [ {} ]
    const result = [ 0 ]

    expect(timing({ duration, keyframes })).toEqual(result)
  })

  it('has multiple items when passed multiple keyframes', () => {
    const duration = 1000

    const keyframes = [
      {},
      { animation: { duration: 250 } },
      { animation: { duration: 250 } },
      { animation: { duration: 300 } }
    ]

    const result = [ 0, 0.25, 0.5, 0.8 ]

    expect(timing({ duration, keyframes })).toEqual(result)
  })
})
