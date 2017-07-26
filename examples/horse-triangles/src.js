import { shape, render, timeline, play } from '../../src'

const horse = document.querySelector('.horse')
const triangles = document.querySelector('.triangles')
const keyframe1 = { el: horse, style: '', transforms: [[ 'reverse' ]] }
const keyframe2 = { el: triangles, style: '', transforms: [[ 'moveIndex', 6 ]] }
const playbackOptions = { alternate: true, iterations: Infinity, duration: 3000 }
const animation = timeline(shape(keyframe1, keyframe2), playbackOptions)

render(document.querySelector('svg'), animation)

play(animation)
