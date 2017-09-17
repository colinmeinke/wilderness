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

  const shapesToRender = []
  const result = split(shapesAndTimelines)
  const shapes = result.shapes
  const timelines = result.timelines

  for (let i = 0, l = shapes.length; i < l; i++) {
    const shape = shapes[ i ]
    shape.node = node(shape.keyframes[ 0 ].frameShape)
    shapesToRender.push(shape)
    shape.rendered = true
  }

  for (let i = 0, l = timelines.length; i < l; i++) {
    const timeline = timelines[ i ]
    const timelineShapes = timeline.timelineShapes
    const frameShapes = frame(timeline)

    for (let _i = 0, _l = timelineShapes.length; _i < _l; _i++) {
      const shape = timelineShapes[ _i ].shape
      shape.node = node(frameShapes[ _i ])
      shapesToRender.push(shape)
    }

    timeline.state.rendered = true
  }

  for (let i = 0, l = shapesToRender.length; i < l; i++) {
    const shape = shapesToRender[ i ]

    if (shape.replace) {
      shape.replace.parentNode.replaceChild(shape.node, shape.replace)
      delete shape.replace
    } else {
      container.appendChild(shape.node)
    }
  }

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
