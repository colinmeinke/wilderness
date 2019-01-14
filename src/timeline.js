/* globals __DEV__ */

import { flushEvents, frame, play as corePlay, timeline as coreTimeline } from 'wilderness-core'
import { updateNode } from 'wilderness-dom-node'

/**
 * Is the tick function running?
 */
let ticks = 0

/**
 * Extends the Wilderness core play function.
 * Adds a call to the tick function.
 *
 * @param {Timeline} t
 * @param {PlaybackOptions} playbackOptions
 * @param {number} [at]
 */
const play = (t, playbackOptions, at) => {
  corePlay(t, playbackOptions, at)
  tick()
}

/**
 * Calculate the active Timeline Shapes and update the corresponding Nodes.
 * Call recursively until there are no longer any active Timelines.
 *
 * @param {number} [at]
 *
 * @example
 * tick()
 */
const tick = at => {
  if (!ticks) {
    if (__DEV__ && typeof at !== 'undefined' && typeof at !== 'number') {
      throw new TypeError(`The tick functions at option must be of type number`)
    }

    window.requestAnimationFrame(() => {
      const a = typeof at !== 'undefined' ? at : Date.now()

      let retick = false

      ticks++

      for (let i = 0, l = timelines.length; i < l; i++) {
        const t = timelines[ i ]
        const state = t.state

        if (state.started && !state.finished && state.rendered) {
          const timelineShapes = t.timelineShapes
          const frameShapes = frame(t, a)

          for (let _i = 0, _l = timelineShapes.length; _i < _l; _i++) {
            updateNode(timelineShapes[ _i ].shape.node, frameShapes[ _i ])
          }

          if (t.events) {
            flushEvents(t)
          }

          retick = true
        }
      }

      ticks--

      if (retick) {
        tick()
      }
    })
  }
}

/**
 * Extends the Wilderness core timeline function.
 * Pushes each timeline into the timelines array.
 *
 * @param {...(Shape|Object[]|TimelineOptions)[]} props
 *
 * @returns {Timeline}
 *
 * @example
 * timeline(circle, [ square, { queue: -200 } ], { duration: 5000 })
 */
const timeline = (...props) => {
  const t = coreTimeline(...props)
  timelines.push(t)
  return t
}

/**
 * An array of every Timeline created.
 */
const timelines = []

export { play, tick }
export default timeline
