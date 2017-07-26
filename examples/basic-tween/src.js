import { shape, render, timeline, play } from '../../src'

const keyframe1 = { type: 'rect', width: 10, height: 10, x: 0, y: 0 }
const keyframe2 = { type: 'rect', width: 10, height: 10, x: 90, y: 90 }

const square = shape(keyframe1, keyframe2)

const playbackOptions = {
  alternate: true,
  duration: 2000,
  iterations: Infinity
}

const animation = timeline(square, playbackOptions)

render(document.querySelector('svg'), animation)

play(animation)
