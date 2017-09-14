/* globals __DEV__ */

import { frame } from 'wilderness-core'
import { node } from 'wilderness-dom-node'
import { tick } from './timeline'

/**
 * An object holding both Shapes and Timelines.
 *
 * @typedef {Object} ShapesAndTimelines
 *
 * @property {Shape[]} shapes
 * @property {Timeline[]} timelines
 */

/**
 * Appends or replaces a Shape Node within a container Node.
 *
 * @param {Node} container
 * @param {Shape} shape
 *
 * @example
 * appendNode(svg, shape)
 */
const appendNode = (container, shape) => {
  if (shape.replace) {
    shape.replace.parentNode.replaceChild(shape.node, shape.replace)
    delete shape.replace
  } else {
    container.appendChild(shape.node)
  }
}

/**
 * Creates a Node for a Shape given a FrameShape.
 *
 * @param {Shape} shape
 * @param {FrameShape} frameShape
 *
 * @example
 * createNode(shape, frameShape)
 */
const createNode = (shape, frameShape) => {
  shape.node = node(frameShape)
}

/**
 * Renders Shapes or Timelines to a container Node.
 *
 * @param {Node} container
 * @param {...(Shape|Timeline)} shapesAndTimelines
 *
 * @example
 * render(svg, shape, timeline)
 */
const render = (container, ...shapesAndTimelines) => {
  if (__DEV__) {
    if (typeof container !== 'object' || !container.nodeName) {
      throw new TypeError(`The render function must be a DOM node as first argument`)
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
    appendNode(container, shape)
    shape.rendered = true
  })

  timelines.map(timeline => {
    timeline.timelineShapes.map(({ shape }) => appendNode(container, shape))
    timeline.state.rendered = true
  })

  tick()
}

/**
 * Splits a Shape and Timeline array into ShapesAndTimelines.
 *
 * @param {(Shape|Timeline)[]} shapesAndTimelines
 *
 * @returns {ShapesAndTimelines}
 *
 * @example
 * split([ shape, timeline ])
 */
const split = shapesAndTimelines => {
  const result = { shapes: [], timelines: [] }

  for (let i = 0, l = shapesAndTimelines.length; i < l; i++) {
    const x = shapesAndTimelines[ i ]

    if (typeof x === 'object' && x.keyframes) {
      if (__DEV__) {
        if (x.timeline) {
          throw new Error(`You cannot render a shape that has been placed on a timeline, instead render the timeline`)
        }

        if (x.rendered) {
          throw new Error(`You cannot render the same shape twice`)
        }
      }

      result.shapes.push(x)
    } else if (typeof x === 'object' && x.middleware && x.playbackOptions && x.state && x.timelineShapes) {
      if (__DEV__ && x.state.rendered) {
        throw new Error(`You cannot render the same timeline twice`)
      }

      result.timelines.push(x)
    } else if (__DEV__) {
      throw new Error(`The render function only takes shapes and timelines from the second argument onwards`)
    }
  }

  return result
}

export default render
