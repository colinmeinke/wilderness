import { shape, render, play } from './tmp'

const shape1 = {
  type: 'circle',
  cx: 10,
  cy: 20,
  r: 10,
  fill: '#E54'
}

const shape2 = {
  type: 'circle',
  cx: 15,
  cy: 50,
  r: 10,
  fill: '#E65'
}

const shape3 = {
  type: 'circle',
  cx: 20,
  cy: 80,
  r: 10,
  fill: '#E76'
}

const positionA = {
  type: 'g',
  strokeWidth: 2,
  stroke: '#000',
  shapes: [ shape1, shape2, shape3 ]
}

const positionB = {
  type: 'g',
  stroke: '#555',
  strokeWidth: 5,
  shapes: [{ ...shape1, cx: 90 }, { ...shape2, cx: 85 }, { ...shape3, cx: 80 }]
}

const animation = shape(positionA, positionB)

render({ selector: '.svg' }, animation)

play(animation, {
  alternate: true,
  duration: 2000,
  iterations: Infinity
})
