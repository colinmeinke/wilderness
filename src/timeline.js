/* globals __DEV__ */

import { events, frame, play as corePlay, timeline as coreTimeline } from 'wilderness-core'
import { updateNode } from 'wilderness-dom-node'

/**
 * Is the tick function running?
 */
let ticking = false

/**
 * Is the Timeline rendered and playing?
 *
 * @param {Timeline} timeline
 *
 * @returns {boolean}
 *
 * @example
 * active(timeline)
 */
const active = ({ state }) => state.started && !state.finished && state.rendered

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
 * @param {boolean} [bypassTickingCheck=false]
 * @param {boolean} [recurse=true]
 * @param {number} [at]
 *
 * @example
 * tick()
 */
const tick = (bypassTickingCheck = false, recurse = true, at) => {
  if (!ticking || bypassTickingCheck) {
    if (__DEV__ && typeof at !== 'undefined' && typeof at !== 'number') {
      throw new TypeError(`The tick functions at option must be of type number`)
    }

    ticking = true

    window.requestAnimationFrame(() => {
      const a = typeof at !== 'undefined' ? at : Date.now()
      const activeTimelines = timelines.filter(active)

      for (let i = 0, l = activeTimelines.length; i < l; i++) {
        const t = activeTimelines[ i ]
        const frameShapes = frame(t, a)

        t.timelineShapes.map(({ shape }, i) => {
          updateNode(shape.node, frameShapes[ i ])
        })

        events(t)
      }

      if (activeTimelines.length && recurse) {
        tick(true)
      } else {
        ticking = false
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

export { active, play, tick }
export default timeline
