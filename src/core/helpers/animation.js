import easingFunctions from 'tween-functions'

/**
 * The animation's current iteration.
 *
 * @param {float} totalIterations - The animation's total iterations.
 *
 * @returns {integer}
 *
 * @example
 * // returns 3
 * currentIteration(2.43)
 */
const currentIteration = totalIterations => (
  Math.max(1, Math.ceil(totalIterations))
)

/**
 * The current reverse state of the animation.
 *
 * @param {Object} options
 * @param {boolean} options.alternate - The animation's alternate setting.
 * @param {integer} options.iteration - The animation's current iteration.
 * @param {boolean} options.reverse - The animation's reverse setting.
 *
 * @returns {boolean}
 *
 * @example
 * // returns false
 * currentReverse({
 *   alternate: false,
 *   iteration: 2,
 *   reverse: false
 * })
 */
const currentReverse = ({ alternate, iteration, reverse }) => (
  alternate ? (iteration % 2 === 0 ? !reverse : reverse) : reverse
)

/**
 * The current state of the animation.
 *
 * @param {Object} [animation={}] - The animation object.
 * @param {boolean} [animation.alternate=false] - Does the animation alternate direction?
 * @param {float} [animation.initialProgress=0] - The progress the animation started with.
 * @param {boolean} [animation.reverse=false] – Does the animation start in reverse?
 * @param {boolean} [animation.started=false] - Has the animation started playback?
 *
 * @returns {Object}
 *
 * @example
 * currentState(animation)
 */
const currentState = (animation = {}) => {
  const {
    alternate = false,
    initialProgress = 0,
    reverse = false,
    started = false
  } = animation

  const iterations = started ? iterationsComplete(animation) : 0
  const totalIterations = iterations + initialProgress
  const iteration = currentIteration(totalIterations)
  const r = currentReverse({ alternate, iteration, reverse })
  const progress = totalIterations - previousIteration(totalIterations)

  return {
    currentProgress: r ? 1 - progress : progress,
    currentReverse: r,
    iterationsComplete: iterations
  }
}

/**
 * An easing function.
 *
 * @param {(function|string)} easing - An easing function or the name of an easing function from tween-functions.
 *
 * @returns {function}
 *
 * @example
 * easingFunc('easeInOutQuad')
 */
const easingFunc = easing => (
  typeof easing === 'function' ? easing : easingFunctions[ easing ]
)

/**
 * Has the animation finished?
 *
 * @param {Object} animation - The animation object.
 * @param {float} animation.iterations - The number of iterations playback will last.
 *
 * @returns {boolean}
 *
 * @example
 * finished(animation)
 */
const finished = animation => (
  iterationsComplete(animation) >= animation.iterations
)

/**
 * The amount of iterations the animation has completed.
 *
 * @param {Object} animation - The animation object.
 * @param {integer} animation.duration – The duration in milliseconds of one iteration of the animation.
 * @param {float} animation.iterations - The number of iterations playback will last.
 * @param {integer} [animation.now=Date.now()] - The current timestamp.
 * @param {integer} animation.play - The timestamp at which the animation was started.
 * @param {integer} [animation.pause] - The timestamp at which the animation was paused.
 *
 * @returns {float}
 *
 * @example
 * iterationsComplete(animation)
 */
const iterationsComplete = ({ duration, iterations, now, play, pause }) => {
  const n = typeof now === 'undefined' ? Date.now() : now
  const time = Math.max(0, pause ? pause - play : n - play)
  return Math.min(iterations, time / duration)
}

/**
 * Is the animation paused?
 *
 * @param {Object} animation - The animation object.
 * @param {integer} [animation.pause] - The timestamp at which the animation was paused.
 *
 * @returns {boolean}
 *
 * @example
 * paused(animation)
 */
const paused = ({ pause }) => Boolean(pause)

/**
 * The animation's previous iteration.
 *
 * @param {float} totalIterations - The animation's total iterations.
 *
 * @returns {integer}
 *
 * @example
 * // returns 1
 * previousIteration(2.43)
 */
const previousIteration = totalIterations => (
  Math.max(0,
    totalIterations % 1 === 0
      ? Math.floor(totalIterations - 0.1)
      : Math.floor(totalIterations)
  )
)

export {
  currentIteration,
  currentState,
  currentReverse,
  easingFunc,
  finished,
  iterationsComplete,
  paused,
  previousIteration
}
