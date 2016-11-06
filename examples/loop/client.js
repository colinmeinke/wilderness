import { shape, render, play } from './tmp'

const arrow = { type: 'path', d: 'M50,5l5,10h-3l-2-1.5l-2,1.5h-3z', fill: '#E54' }

const motionPath = {
  type: 'circle',
  cx: 0,
  cy: 40,
  r: 40,
  accuracy: 0.1,
  easing: 'linear',
  rotate: true
}

const motionPathStroke = shape({
  ...motionPath,
  offset: [ 50, 10 ],
  fill: 'none',
  stroke: '#EEE'
})

const animation = shape(arrow, { motionPath })

render({ selector: '.svg' }, motionPathStroke, animation)

play(animation, {
  duration: 8000,
  iterations: Infinity
})
