plain shape object
- core shape props
- shape mainpulation props
- style props
- animation props

one or more plain shape objects are passed to shape function

the shape function returns a shape

{
  timeline: {
    duration,
    keyframes,
    motionPaths,
    timing: timing(keyframes, duration)
  }
}


/**
 * @typedef {Object} PlainShapeObject
 *
 * @property {string} type - The shape type.
 */

/**
 * @typedef {Object} CoreShapeProps
 *
 * @property {string} type - The shape type.
 */

/**
 * @typedef {Object} Shape
 *
 * @property {Timeline} timeline
 */

/**
 * Stores the data required to calculate the state of the shape at
 * any point in time.
 * @typedef {Object} Timeline
 *
 * @property {number} duration - The duration of the shape's animation.
 * @property {Keyframe[]} keyframes - The shape's keyframes.
 * @property {(MotionPath|undefined)[]} motionPaths - A map of keyframe motion paths.
 * @property {Timing} timing
 */

/**
 * Stores the desired shape at the endpoint of the keyframe, and the animation
 * data required to calculate the transition from the previous keyframe.
 * @typedef {Object} Keyframe
 *
 * @property {Animation} [animation] - The keyframe's animation properties.
 */

/**
 * @typedef {Object} MotionPath
 *
 *
 */

/**
 * Maps keyframes start progress on scale of 0 to 1.
 * @typedef {Number[]} Timing
 */



/**
 * @typedef {Object} AnimationProps
 *
 * @property {number} [delay] -
 * @property {number} [duration] -
 * @property {(function|string)} [easing] -
 * @property {function} [finish] -
 * @property {CoreShapeProps} [motionPath] -
 * @property {} [name] -
 * @property {function} [start] -
 * @property {function} [update] -
 */

import {
  animationDefaults,
  animationProps,
  manipulationProps,
  shapeProps,
  styleProps
} from './props'

import { filter } from '../helpers'
import { moveIndex, offset, reverse, scale } from 'points'
import { toPoints } from 'svg-points'

/**
 * The combined duration of all keyframes.
 *
 * @param {Keyframe[]} keyframes - The shape's keyframes.
 *
 * @returns {number}
 *
 * @example
 * addDurations(keyframes)
 */
const addDurations = keyframes => keyframes.reduce((d, { animation }) => (
  animation ? d + animation.duration : d
), 0)

const create = shapes => {
  const keyframes = []
  const motionPaths = []

  shapes.map(({ motionPath, ...shape }, i) => {
    const plainShapeObject = shape.type ? shape : shapes[ i - 1 ]
    keyframes.push(keyframe({ isFirstKeyframe: i === 0, plainShapeObject }))
    motionPaths.push(motionPath)
  })

  const duration = addDurations(keyframes)

  return {
    timeline: {
      duration,
      keyframes,
      motionPaths,
      timing: timing(keyframes, duration)
    }
  }
}

/**
 * Creates a keyframe from a plain shape object.
 *
 * @param {Object} options
 * @param {boolean} options.isFirstKeyframe - Is this the shape's first keyframe?
 * @param {Object} options.plainShapeObject - The shape the keyframe is transitioning to.
 *
 * @returns {Keyframe}
 *
 * @example
 * keyframe({ isFirstKeyframe, plainShapeObject })
 */
const keyframe = ({ isFirstKeyframe, plainShapeObject }) => {
  const { shapes, ...shape } = plainShapeObject
  const s = [ shape ]

  if (shapes) {
    shapes.map(x => s.push(x))
  }

  const k = { shapes: s.map(keyframeShape) }

  if (!isFirstKeyframe) {
    k.animation = {
      ...animationDefaults,
      ...filter(animationProps, shape)
    }
  }

  return k
}

const keyframeShape = shape => {
  const k = { styles: filter(styleProps, shape) }

  if (shape.type !== 'g') {
    const manipulations = filter(manipulationProps, shape)
    const points = toPoints(filter(shapeProps, shape))
    k.points = manipulate(points, manipulations)
  }

  return k
}

const manipulate = (points, manipulations) => {
  let p = [ ...points ]

  Object.keys(manipulations).forEach(k => {
    const args = manipulations[ k ]

    switch (k) {
      case 'moveIndex':
        p = moveIndex(p, args)
        break

      case 'offset':
        const [ x = 0, y = 0 ] = args

        p = offset(p, x, y)

        break

      case 'reverse':
        if (args) {
          p = reverse(p)
        }

        break

      case 'scale':
        const isArray = Array.isArray(args)
        const scaleFactor = isArray ? args[ 0 ] : args
        const anchor = isArray ? args[ 1 ] : 'center'

        p = scale(p, scaleFactor, anchor)

        break
    }
  })

  return p
}

const timing = (keyframes, duration) => {
  let currentDuration = 0

  return keyframes.map(({ animation }) => {
    if (animation) {
      currentDuration += animation.duration
      return currentDuration / duration
    }

    return currentDuration
  })
}

export {
  addDurations,
  keyframe,
  keyframeShape,
  manipulate,
  timing
}

export default create
