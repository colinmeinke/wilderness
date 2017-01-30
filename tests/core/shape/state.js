/* globals describe it expect */

import { styleAttributes }  from '../../../src/core/shape/state'

const stylePropAttrMap = {
  fill: 'fill',
  fillOpacity: 'fill-opacity',
  fillRule: 'fill-rule',
  stroke: 'stroke',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeOpacity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  vectorEffect: 'vector-effect'
}

describe('styleAttributes', () => {
  it('converts style props to correct style attributes', () => {
    const props = {
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

    expect(styleAttributes(props)).toEqual(attributes)
  })

  it('filters out unrecognised keys', () => {
    const props = {
      fill: '#FFF',
      foo: 'bar'
    }

    const attributes = { fill: '#FFF' }

    expect(styleAttributes(props)).toEqual(attributes)
  })
})
