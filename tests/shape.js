import shape from '../src/shape'

const createEl = () => {
  const el = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  el.setAttribute('d', 'M0,0H10')
  return el
}

describe('shape', () => {
  it('should not change core shape behaviour')

  it('should throw if passed an invalid node')

  it('should calculate keyframe attributes from node', () => {
    const el = createEl()

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
    const el = createEl()
    const { keyframes } = shape({ el })
    const expectedPoints = [{ x: 0, y: 0, moveTo: true }, { x: 10, y: 0 }]
    expect(keyframes[ 0 ].frameShape.points).to.eql(expectedPoints)
  })

  it('should merge attributes from both node and object')

  it('should throw if replace option is not a node')

  it('should add replace prop to shape if passed a replace option')
})
