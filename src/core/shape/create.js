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
 * The combined duration of all shape keyframes.
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
 * A shape created from one or more plain shape objects.
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
 * A keyframe created from a plain shape object.
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
 * A keyframe shape created from a plain shape object.
 *
 * @param {PlainShapeObject} planShapeObject
 *
 * @returns {FrameShape}
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
 * A timing array created from keyframes and duration.
 *
 * @param {Object} options
 * @param {Duration} options.duration - The duration of the shape's animation.
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
