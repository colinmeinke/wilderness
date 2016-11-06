import { shape, render, play } from './tmp'

const from = {
  type: 'circle',
  cx: 25,
  cy: 25,
  r: 25,
  fill: '#E54'
}

const to = {
  type: 'path',
  d: 'M75,75l10-5l15,20v10h-10l-5-5l-10,5z',
  fill: '#0FA',
  moveIndex: 1
}

const animation = shape(from, to)

render({ selector: '.svg' }, animation)

play(animation, {
  alternate: true,
  duration: 2000,
  iterations: Infinity
})
