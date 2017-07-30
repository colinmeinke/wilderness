/* globals describe it expect */

import { node } from 'wilderness-dom-node'
import render from '../src/render'
import shape from '../src/shape'
import timeline, { active, play, tick } from '../src/timeline'

describe('active', () => {
  it('should return false if not started', () => {
    const state = { started: false, finished: false, rendered: true }
    expect(active({ state })).to.equal(false)
  })

  it('should return false if finished', () => {
    const state = { started: true, finished: true, rendered: true }
    expect(active({ state })).to.equal(false)
  })

  it('should return false if not rendered', () => {
    const state = { started: true, finished: false, rendered: false }
    expect(active({ state })).to.equal(false)
  })

  it('should return true if started, not finished and rendered', () => {
    const state = { started: true, finished: false, rendered: true }
    expect(active({ state })).to.equal(true)
  })
})

describe('timeline', () => {
  it('should not change core timeline behaviour', () => {
    const alternate = true
    const duration = 500
    const initialIterations = 0.5
    const iterations = 3
    const reverse = true
    const started = 10
    const s = shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' })
    const t = timeline(s, { alternate, duration, initialIterations, iterations, reverse, started })
    expect(t).to.have.property('middleware')
    expect(t).to.have.property('playbackOptions')
    expect(t).to.have.property('state')
    expect(t).to.have.property('timelineShapes')
    expect(t.playbackOptions.alternate).to.equal(alternate)
    expect(t.playbackOptions.duration).to.equal(duration)
    expect(t.playbackOptions.initialIterations).to.equal(initialIterations)
    expect(t.playbackOptions.iterations).to.equal(iterations)
    expect(t.playbackOptions.reverse).to.equal(reverse)
    expect(t.playbackOptions.started).to.equal(started)
    expect(t.state.started).to.equal(true)
  })
})

describe('play', () => {
  it('should not change core play behaviour', () => {
    const at = 50
    const t = timeline(shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' }))
    expect(t.state.started).to.equal(false)
    play(t, {}, at)
    expect(t.playbackOptions.started).to.equal(at)
    expect(t.state.started).to.equal(true)
  })
})

describe('tick', () => {
  it('should throw if passed an invalid at option', () => {
    expect(() => tick({ at: 'potato', bypassTickingCheck: true }))
      .to.throw('The tick functions at option must be of type number')
  })

  it('should update active Timelines', () => {
    const s = shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' })
    const t = timeline(s, { duration: 1000, started: 0 })

    const preTickExpectedEl = node({
      attributes: {},
      points: [{ x: 0, y: 0, moveTo: true }, { x: 10, y: 0 }]
    })

    const postTickExpectedEl = node({
      attributes: {},
      points: [{ x: 5, y: 0, moveTo: true }, { x: 15, y: 0 }]
    })

    render(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), t)

    expect(s.node.toString()).to.eql(preTickExpectedEl.toString())

    tick({ at: 500, recurse: false })

    expect(s.node.toString()).to.eql(postTickExpectedEl.toString())
  })

  it('should update timeline until complete', done => {
    let currentAx = 0
    let currentBx = 10

    const started = Date.now()

    const s = shape({ type: 'path', d: `M${currentAx},0H10` }, { type: 'path', d: `M${currentBx},0H20` })
    const t = timeline(s, { duration: 50, started })

    const xVals = s => {
      const [ a, bx ] = s.node.getAttribute('d').substr(1).split('H')
      const [ ax ] = a.split(',')
      return [ parseFloat(ax), parseFloat(bx) ]
    }

    render(document.createElementNS('http://www.w3.org/2000/svg', 'svg'), t)

    tick()

    const i = setInterval(() => {
      const now = Date.now()
      const d = Math.min(50, now - started)
      const p = d / 50
      const [ ax, bx ] = xVals(s)

      expect(ax >= currentAx).to.equal(true)
      expect(bx >= currentBx).to.equal(true)
      expect(bx - ax).to.be.closeTo(10, 0.0000001)

      if (ax === 10 && bx === 20) {
        clearInterval(i)
        done()
      }

      currentAx = ax
      currentBx = bx
    }, 10)
  })
})
