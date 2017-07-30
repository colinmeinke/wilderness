/* globals describe it expect */

import {
  colorMiddleware,
  motionPath,
  pause,
  plainShapeObject,
  play,
  render,
  shape,
  timeline,
  unitMiddleware
} from '../src'

describe('colorMiddleware', () => {
  it('should be exported', () => {
    expect(colorMiddleware).to.be.a('object')
    expect(colorMiddleware).to.have.property('name')
    expect(colorMiddleware).to.have.property('input')
    expect(colorMiddleware).to.have.property('output')
  })
})

describe('motionPath', () => {
  it('should be exported', () => {
    expect(motionPath).to.be.a('function')
  })
})

describe('pause', () => {
  it('should be exported', () => {
    expect(pause).to.be.a('function')
  })
})

describe('plainShapeObject', () => {
  it('should be exported', () => {
    expect(plainShapeObject).to.be.a('function')
  })
})

describe('play', () => {
  it('should be exported', () => {
    expect(play).to.be.a('function')
  })
})

describe('render', () => {
  it('should be exported', () => {
    expect(render).to.be.a('function')
  })
})

describe('shape', () => {
  it('should be exported', () => {
    expect(shape).to.be.a('function')
  })
})

describe('timeline', () => {
  it('should be exported', () => {
    expect(timeline).to.be.a('function')
  })
})

describe('unitMiddleware', () => {
  it('should be exported', () => {
    expect(unitMiddleware).to.be.an('object')
    expect(unitMiddleware).to.have.property('name')
    expect(unitMiddleware).to.have.property('input')
    expect(unitMiddleware).to.have.property('output')
  })
})
