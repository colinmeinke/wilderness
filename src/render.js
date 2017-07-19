/* globals __DEV__ */

import { frame } from 'wilderness-core'
import { node } from 'wilderness-dom-node'
import { tick } from './timeline'

const createNode = (shape, frameShape) => {
  shape.node = node(frameShape)
}

const split = shapesAndTimelines => {
  const shapes = []
  const timelines = []

  shapesAndTimelines.map(x => {
    if (x.keyframes) {
      if (__DEV__ && x.timeline) {
        throw new Error(`You cannot render a shape that has been placed on a timeline, instead render the timeline`)
      }

      shapes.push(x)
    } else {
      // @todo validate timeline
      timelines.push(x)
    }
  })

  return { shapes, timelines }
}

const render = (container, ...shapesAndTimelines) => {
  if (__DEV__) {
    if (typeof container !== 'object' || !container.nodeName) {
      throw new TypeError(`The first argument passed to the render function must be a dom node`)
    }
  }

  const { shapes, timelines } = split(shapesAndTimelines)

  shapes.map(shape => {
    createNode(shape, shape.keyframes[ 0 ].frameShape)
  })

  timelines.map(timeline => {
    const frameShapes = frame(timeline)

    timeline.timelineShapes.map(({ shape }, i) => {
      createNode(shape, frameShapes[ i ])
    })
  })

  shapes.map(shape => {
    container.appendChild(shape.node)
  })

  timelines.map(timeline => {
    timeline.timelineShapes.map(({ shape }) => {
      container.appendChild(shape.node)
    })

    timeline.state.rendered = true
  })

  tick()
}

export default render
