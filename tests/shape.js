/* globals describe it expect */

import shape from '../src/shape'

const createGroup = () => {
  const g = document.createElementNS('http://www.w3.org/2000/svg', 'g')
  g.appendChild(createPath())
  g.appendChild(createPath())
  return g
}

const createPath = () => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  el.setAttribute('d', 'M0,0H10')
  return el
}

describe('shape', () => {
  it('should not change core shape behaviour', () => {
    const name = 'CIRCLE'
    const duration = 600

    const circle = {
      type: 'circle',
      cx: 50,
      cy: 50,
      r: 20,
      fill: '#E54'
    }

    const square = {
      type: 'rect',
      width: 50,
      height: 50,
      x: 100,
      y: 100,
      duration
    }

    const s = shape(circle, square, { name })

    expect(s).to.have.property('keyframes')
    expect(s).to.have.property('duration')
    expect(s).to.have.property('name')
    expect(s.keyframes.length).to.equal(2)
    expect(s.duration).to.equal(duration)
    expect(s.name).to.equal(name)
  })

  it('should throw if passed an invalid node', () => {
    expect(() => shape({ el: 'potato' })).to.throw('el must be a DOM node')
  })

  it('should calculate keyframe attributes from node', () => {
    const el = createPath()

    el.setAttribute('fill', 'yellow')
    el.classList.add('potato')

    const { keyframes } = shape({ el })
    const { attributes } = keyframes[ 0 ].frameShape

    expect(attributes).to.have.property('fill')
    expect(attributes).to.have.property('class')
    expect(attributes.fill).to.equal('yellow')
    expect(attributes.class).to.equal('potato')
  })

  it('should calculate keyframe points from node', () => {
    const el = createPath()
    const { keyframes } = shape({ el })
    const expectedPoints = [{ x: 0, y: 0, moveTo: true }, { x: 10, y: 0 }]
    expect(keyframes[ 0 ].frameShape.points).to.eql(expectedPoints)
  })

  it('should calculate keyframe childFrameShapes from node', () => {
    const el = createGroup()
    const { keyframes } = shape({ el })
    expect(keyframes[ 0 ].frameShape).to.have.property('childFrameShapes')
    expect(keyframes[ 0 ].frameShape.childFrameShapes).to.be.an('array')
  })

  it('should merge attributes from both node and object', () => {
    const el = createPath()

    el.setAttribute('fill', 'yellow')
    el.setAttribute('stroke', 'red')

    const { keyframes } = shape({ el, stroke: 'green' })
    const { attributes } = keyframes[ 0 ].frameShape

    expect(attributes).to.have.property('fill')
    expect(attributes).to.have.property('stroke')
    expect(attributes.fill).to.equal('yellow')
    expect(attributes.stroke).to.equal('green')
  })

  it('should throw if replace option is not a node', () => {
    expect(() => shape({ type: 'path', d: 'M0,0H10' }, { replace: 'potato' }))
      .to.throw('The replace option must be a DOM node')
  })

  it('should add replace prop to shape if passed a replace option', () => {
    const el = createPath()
    const s = shape({ el }, { replace: el })
    expect(s).to.have.property('replace')
    expect(s.replace).to.be.eql(el)
  })
})
