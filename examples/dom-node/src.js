import { shape, render, timeline, play } from '../../src'

const el = document.querySelector('rect')

const keyframe1 = { el }

const keyframe2 = {
  el,
  fill: 'yellow',
  transforms: [[ 'offset', 70, 70 ]]
}

const shapeOptions = { replace: el }

const square = shape(keyframe1, keyframe2, shapeOptions)

const playbackOptions = {
  alternate: true,
  duration: 2000,
  iterations: Infinity
}

const animation = timeline(square, playbackOptions)

render(document.querySelector('svg'), animation)

play(animation)
