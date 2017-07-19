import { frame, play as corePlay, timeline as coreTimeline } from 'wilderness-core'
import { updateNode } from 'wilderness-dom-node'

let ticking = false

const active = ({ state }) => state.started && !state.finished && state.rendered

const play = (t, playbackOptions, at) => {
  corePlay(t, playbackOptions, at)
  tick()
}

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

const timeline = (...props) => {
  const t = coreTimeline(...props)
  timelines.push(t)
  return t
}

const timelines = []

export { play, tick }
export default timeline
