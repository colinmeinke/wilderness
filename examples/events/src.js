import { shape, render, timeline, play } from '../../src'

const shape1Keyframe1 = { type: 'rect', width: 10, height: 10, x: 10, y: 45, name: 'KEYFRAME_1' }
const shape1Keyframe2 = { type: 'rect', width: 10, height: 10, x: 40, y: 45, name: 'KEYFRAME_2' }

const shape1 = shape(shape1Keyframe1, shape1Keyframe2)

const shape2Keyframe1 = { type: 'rect', width: 10, height: 10, x: 50, y: 45, name: 'KEYFRAME_1' }
const shape2Keyframe2 = { type: 'rect', width: 10, height: 10, x: 70, y: 45, name: 'KEYFRAME_2' }

const shape2 = shape(shape2Keyframe1, shape2Keyframe2)

const playbackOptions = { alternate: true, duration: 10000, iterations: Infinity }

const animation = timeline(
  [ shape1, { name: 'SHAPE_1' } ],
  [ shape2, { name: 'SHAPE_2' } ],
  playbackOptions
)

animation.event.subscribe('timeline.start', () => console.log('timeline.start'))
animation.event.subscribe('timeline.finish', () => console.log('timeline.finish'))
animation.event.subscribe('shape.start', ({ shapeName }) => console.log(`shape.start ${shapeName}`))
animation.event.subscribe('shape.finish', ({ shapeName }) => console.log(`shape.finish ${shapeName}`))
animation.event.subscribe('keyframe', ({ keyframeName, shapeName }) => console.log(`keyframe ${shapeName} ${keyframeName}`))
animation.event.subscribe('frame', () => console.log('frame'))

render(document.querySelector('svg'), animation)

play(animation)
