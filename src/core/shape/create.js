/**
 * An SVG shape, its associated style and instructions on how to animate
 * to it from a previous state.
 *
 * @typedef {Object} PlainShapeObject
 *
 * @extends ShapeCoreProps
 * @extends ShapeManipulationProps
 * @extends ShapeStyleProps
 * @extends AnimationProps
 */

/**
 * An SVG shape as defined by https://github.com/colinmeinke/svg-points.
 *
 * @typedef {Object} ShapeCoreProps
 */

/**
 * Manipulations to be applied to shape core props.
 *
 * @typedef {Object} ShapeManipulationProps
 *
 * @property {integer} [moveIndex] - the amount of points by which to offset a shape's index point.
 * @property {number[]} [offset] - the amount to offset a shape's points horizontally and vertically.
 * @property {number} [rotate] - the clockwise angle to rotate the shape.
 * @property {boolean} [reverse] - reverses the shape's points.
 * @property {(number|(number|string)[])} [scale] - scales a shape.
 */

/**
 * Attributes to be applied to an SVG shape.
 *
 * @typedef {Object} ShapeStyleProps
 *
 * @property {string} [fill] - defines the shape's fill attribute.
 * @property {number} [fillOpactity] - defines the shape's fill-opacity attribute.
 * @property {string} [fillRule] - defines the shape's fill-rule attribute.
 * @property {string} [stroke] - defines the shape's stroke attribute.
 * @property {string} [strokeDasharray] - defines the shape's stroke-dasharray attribute.
 * @property {string} [strokeDashoffset] - defines the shape's stroke-dashoffset attribute.
 * @property {string} [strokeLinecap] - defines the shape's stroke-linecap attribute.
 * @property {string} [strokeLinejoin] - defines the shape's stroke-linejoin attribute.
 * @property {number} [strokeOpactity] - defines the shape's stroke-opacity attribute.
 * @property {number} [strokeWidth] - defines the shape's stroke-width attribute.
 * @property {string} [vectorEffect] - defines the shape's vector-effect attribute.
 */

/**
 * Instructions on how to animate from a previous state.
 *
 * @typedef {Object} AnimationProps
 *
 * @property {number} [delay] - defines how many milliseconds to wait before the animation starts.
 * @property {number} [duration] - defines how many milliseconds the animation lasts.
 * @property {(function|string)} [easing] - An easing function or the name of an easing function from https://github.com/chenglou/tween-functions.
 * @property {function} [finish] - A function that is called when the animation finishes.
 * @property {MotionPath} [motionPath]
 * @property {string} [name] - Used to reference this animation.
 * @property {function} [start] - A function that is called when the animation starts.
 * @property {function} [update] - A function that is called every time the animation updates.
 */

/**
 * A shape that can have multiple states over time.
 *
 * @typedef {Object} Shape
 *
 * @property {Timeline} timeline
 */

/**
 * Shape and animation data required to calculate the state
 * of the shape at any point in time.
 *
 * @typedef {Object} Timeline
 *
 * @property {number} duration - The duration of the shape's animation.
 * @property {Keyframe[]} keyframes - The shape's keyframes.
 * @property {(MotionPath|undefined)[]} motionPaths - A map of keyframe motion paths.
 * @property {Timing} timing
 */

/**
 * A keyframe is made up of one or more shapes, and the animation data
 * required to calculate the transition from the previous keyframe.
 *
 * @typedef {Object} Keyframe
 *
 * @property {Animation} [animation] - The keyframe's animation properties.
 * @property {KeyframeShape[]} shapes - All of the keyframe's shapes.
 */

/**
 * Shape and style data for a single shape within a keyframe.
 *
 * @typedef {Object} KeyframeShape
 *
 * @property {ShapeStyleProps} styles
 * @property {Points} [points]
 */

/**
 * Shape data as defined by https://github.com/colinmeinke/points.
 *
 * @typedef {Object[]} Points
 */

/**
 * The data required to calculate a non-linear transition
 * between two keyframes.
 *
 * This is relative to the keyframe shape.
 *
 * @typedef {Object} MotionPath
 *
 * @extends CoreShapeProps
 * @property {number} [accuracy] - A number between 0 and 360 that is used to calculate if a curve is straight enough to be considered a straight line.
 * @property {(function|string)} [easing] - An easing function or the name of an easing function from https://github.com/chenglou/tween-functions.
 * @property {(boolean|number)} [rotate] - A boolean defines if the shape should be rotated with the angle of the motion path. A number defines the angle offset of the motion path to rotate the shape.
 */

/**
 * A map of keyframe animation start intervals.
 *
 * @typedef {Number[]} Timing
 */

import {
  animationDefaults,
  animationProps,
  manipulationProps,
  shapeProps,
  styleProps
} from './props'

import { filter } from '../helpers'
import { moveIndex, offset, reverse, rotate, scale } from 'points'
import { toPoints } from 'svg-points'

/**
 * Calculate the combined duration of all shape keyframes.
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

/**
 * Create a shape from one or more plain shape objects.
 *
 * @param {PlainShapeObject[]} shapes
 *
 * @returns {Shape}
 *
 * @example
 * create([ plainShapeObject, plainShapeObject ])
 */
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
      timing: timing({ duration, keyframes })
    }
  }
}

/**
 * Create a keyframe from a plain shape object.
 *
 * @param {Object} options
 * @param {boolean} options.isFirstKeyframe - Is this the shape's first keyframe?
 * @param {PlainShapeObject} options.plainShapeObject - The keyframe's end shape.
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

/**
 * Create a keyframe shape from a plain shape object.
 *
 * @param {PlainShapeObject} planShapeObject
 *
 * @returns {KeyframeShape}
 *
 * @example
 * keyframeShape(plainShapeObject)
 */
const keyframeShape = plainShapeObject => {
  const k = { styles: filter(styleProps, plainShapeObject) }

  if (plainShapeObject.type !== 'g') {
    const manipulations = filter(manipulationProps, plainShapeObject)
    const points = toPoints(filter(shapeProps, plainShapeObject))
    k.points = manipulate({ manipulations, points })
  }

  return k
}

/**
 * Apply manipulations to a set of points.
 *
 * @param {ShapeManipulationProps} manipulations - The manipulations to apply to the points.
 * @param {Points} points - The points to manipulate.
 *
 * @returns {Points}
 *
 * @example
 * mainpulate({ manipulations, points })
 */
const manipulate = ({ manipulations, points }) => (
  Object.keys(manipulations).reduce((nextPoints, key) => {
    const args = manipulations[ key ]

    switch (key) {
      case 'moveIndex':
        return moveIndex(nextPoints, args)

      case 'offset':
        const [ x = 0, y = 0 ] = args
        return offset(nextPoints, x, y)

      case 'reverse':
        if (args) {
          return reverse(nextPoints)
        }

        break

      case 'rotate':
        return rotate(nextPoints, args)

      case 'scale':
        const isArray = Array.isArray(args)
        const scaleFactor = isArray ? args[ 0 ] : args
        const anchor = isArray ? args[ 1 ] : 'center'

        return scale(nextPoints, scaleFactor, anchor)
    }

    return nextPoints
  }, [ ...points ])
)

/**
 * Creates a timing array from keyframes and duration.
 *
 * @param {Object} options
 * @param {number} options.duration - The duration of the shape's animation.
 * @param {Keyframe[]} options.keyframes
 *
 * @returns {Timing}
 *
 * @example
 * timing({ duration, keyframes })
 */
const timing = ({ duration, keyframes }) => {
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
