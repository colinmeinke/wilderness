import { shape, render, timeline, play } from '../../src'

const tree = document.querySelector('.tree')
const treeInWind = document.querySelector('.tree-in-wind')

const keyframe1 = {
  el: tree,
  style: ''
}

const keyframe2 = {
  el: treeInWind,
  easing: 'easeInOutBack',
  duration: 3500,
  style: ''
}

const tree1 = [
  shape(
    { ...keyframe1, transforms: [[ 'offset', 0, -24 ]] },
    { ...keyframe2, transforms: [[ 'offset', 0, -24 ]] },
    { replace: tree }
  ),
  { name: 'tree1' }
]

const tree2 = [
  shape(
    { ...keyframe1, transforms: [[ 'offset', 48, 0 ]] },
    { ...keyframe2, transforms: [[ 'offset', 48, 0 ]] },
    { replace: treeInWind }
  ),
  { queue: { at: 'tree1' } }
]

const tree3 = [
  shape(
    { ...keyframe1, transforms: [[ 'offset', -48, 0 ]] },
    { ...keyframe2, transforms: [[ 'offset', -48, 0 ]] }
  ),
  { queue: { at: 'tree1', offset: -500 } }
]

const tree4 = [
  shape(
    { ...keyframe1, transforms: [[ 'offset', 0, 24 ]] },
    { ...keyframe2, transforms: [[ 'offset', 0, 24 ]] }
  ),
  { queue: { at: 'tree1', offset: -500 } }
]

const playbackOptions = {
  alternate: true,
  iterations: Infinity
}

const animation = timeline(tree1, tree2, tree3, tree4, playbackOptions)

render(document.querySelector('svg'), animation)

play(animation)
