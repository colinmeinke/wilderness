import { frame, play as corePlay, timeline as coreTimeline } from 'wilderness-core'
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
 * @param {Object} opts
 * @param {boolean} [bypassTickingCheck=false]
 *
 * @example
 * tick()
 */
const tick = ({ bypassTickingCheck = false } = {}) => {
  if (!ticking || bypassTickingCheck) {
    ticking = true

    window.requestAnimationFrame(() => {
      const activeTimelines = timelines.filter(active)

      activeTimelines.map(t => {
        const frameShapes = frame(t)

        t.timelineShapes.map(({ shape }, i) => {
          updateNode(shape.node, frameShapes[ i ])
        })
      })

      if (activeTimelines.length) {
        tick({ bypassTickingCheck: true })
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

export { play, tick }
export default timeline
