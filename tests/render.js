/* globals describe it expect */

import { node } from 'wilderness-dom-node'
import render from '../src/render'
import shape from '../src/shape'
import timeline from '../src/timeline'

const createSvg = () => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  return el
}

describe('render', () => {
  it('should throw if not passed a Node as the first argument', () => {
    const s = shape({ type: 'path', d: 'M0,0H10' })
    expect(() => render('potato', s))
      .to.throw('The render function must be a DOM node as first argument')
  })

  it('should throw if passed an item that is not a shape or a timeline', () => {
    const svg = createSvg()
    expect(() => render(svg, 'potato'))
      .to.throw('The render function only takes shapes and timelines from the second argument onwards')
  })

  it('should throw if passed a shape that has been placed on a timeline', () => {
    const svg = createSvg()
    const s = shape({ type: 'path', d: 'M0,0H10' })
    timeline(s)
    expect(() => render(svg, s))
      .to.throw('You cannot render a shape that has been placed on a timeline, instead render the timeline')
  })

  it('should correctly render a node element when passed a shape', () => {
    const svg = createSvg()
    const s = shape({ type: 'path', d: 'M0,0H10' })
    const expectedEl = node(s.keyframes[ 0 ].frameShape)

    render(svg, s)

    expect(s).to.have.property('node')
    expect(s.node.toString()).to.eql(expectedEl.toString())
  })

  it('should correctly render a node element when passed a timeline', () => {
    const svg = createSvg()
    const s = shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' })
    const t = timeline(s, { initialIterations: 0.5 })

    const expectedEl = node({
      attributes: {},
      points: [{ x: 5, y: 0, moveTo: true }, { x: 15, y: 0 }]
    })

    render(svg, t)

    expect(s).to.have.property('node')
    expect(s.node.toString()).to.eql(expectedEl.toString())
  })

  it('should correctly append a shape to a container', () => {
    const svg = createSvg()
    const s = shape({ type: 'path', d: 'M0,0H10' })
    render(svg, s)
    expect(svg.childNodes[ 0 ]).to.equal(s.node)
  })

  it('should correctly append a group shape to a container', () => {
    const svg = createSvg()

    const s = shape({
      type: 'g',
      shapes: [
        { type: 'path', d: 'M0,0H10' },
        { type: 'path', d: 'M10,0H20' }
      ]
    })

    render(svg, s)

    expect(svg.childNodes[ 0 ]).to.equal(s.node)
    expect(svg.childNodes[ 0 ].nodeName).to.equal('g')
    expect(svg.childNodes[ 0 ].childNodes[ 0 ].nodeName).to.equal('path')
    expect(svg.childNodes[ 0 ].childNodes[ 1 ].nodeName).to.equal('path')
  })

  it('should correctly append a timeline to a container', () => {
    const svg = createSvg()
    const s = shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H10' })
    const t = timeline(s, { initialIterations: 0.5 })
    render(svg, t)
    expect(svg.childNodes[ 0 ]).to.equal(s.node)
  })

  it('should correctly replace a shape in a container', () => {
    const svg = createSvg()
    const el = node({ attributes: {}, points: [{ x: 10, y: 10, moveTo: true }, { x: 20, y: 10 }] })

    svg.appendChild(el)

    const s = shape({ type: 'path', d: 'M0,0H10' }, { replace: el })

    render(svg, s)

    expect(svg.childNodes.length).to.equal(1)
    expect(svg.childNodes[ 0 ]).to.equal(s.node)
  })

  it('should correctly replace a timeline in a container', () => {
    const svg = createSvg()
    const el = node({ attributes: {}, points: [{ x: 10, y: 10, moveTo: true }, { x: 20, y: 10 }] })

    svg.appendChild(el)

    const s = shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' }, { replace: el })
    const t = timeline(s)

    render(svg, t)

    expect(svg.childNodes.length).to.equal(1)
    expect(svg.childNodes[ 0 ]).to.equal(s.node)
  })

  it('should throw when trying to render and already rendered shape', () => {
    const svg = createSvg()
    const s = shape({ type: 'path', d: 'M0,0H10' })
    render(svg, s)
    expect(() => render(svg, s)).to.throw('You cannot render the same shape twice')
  })

  it('should throw when trying to render and already rendered timeline', () => {
    const svg = createSvg()
    const s = shape({ type: 'path', d: 'M0,0H10' }, { type: 'path', d: 'M10,0H20' })
    const t = timeline(s)
    render(svg, t)
    expect(() => render(svg, t)).to.throw('You cannot render the same timeline twice')
  })
})
