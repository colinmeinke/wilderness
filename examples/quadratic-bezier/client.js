import { shape, render } from './tmp'

const curve = {
  type: 'path',
  d: 'M2 2.078S4.987 4.73 11 4.73s9-2.652 9-2.652',
  fill: 'none',
  stroke: '#0FA'
}

render({ selector: '.svg' }, shape(curve))
