import { paused } from '../helpers'

/**
 * Pauses a playable.
 *
 * @param {Playable} options
 *
 * @example
 * pause(playable)
 */
const pause = ({ now, state }) => {
  const { animation } = state
  const n = typeof now === 'undefined' ? Date.now() : now

  if (animation && !paused(animation)) {
    animation.pause = n
  }
}

export default pause
