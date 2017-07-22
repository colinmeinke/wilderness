import { shape, render, timeline, play } from '../../src'

const tree = document.querySelector('.tree')
const treeInWind = document.querySelector('.tree-in-wind')

const playbackOptions = {
  alternate: true,
  duration: 5000,
  iterations: Infinity
}

const animation = timeline(
  shape(
    { el: tree, style: '' },
    { el: treeInWind, easing: 'easeInOutBack', style: '' },
    { replace: tree }
  ),
  playbackOptions
)

render(document.querySelector('svg'), animation)

play(animation)
