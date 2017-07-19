import { shape, render, timeline, play } from '../../src'

const el = document.querySelector('rect')

const square = shape({ el }, {
  el,
  fill: 'yellow',
  transforms: [[ 'offset', 80, 80 ]]
})

const animation = timeline(square, {
  alternate: true,
  duration: 2000,
  iterations: Infinity
})

render(document.querySelector('svg'), animation)

play(animation)
