/* globals describe it expect */

import {
  shapeAttributes,
  styleAttributes
} from '../../../src/core/shape/state'

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
