import { currentProgressState, easingFunc, normalise, tween } from '../helpers'
import { offset, position, rotate } from 'points'
import { stylePropAttrMap } from './props'
import { toPath, toPoints } from 'svg-points'

/**
 * The current state of the animation.
 *
 * @param {Shape}
 *
 * @returns {AnimationState}
 *
 * @example
 * animationState(shape)
 */
const animationState = ({ state, timeline }) => {
  const { keyframes, timing } = timeline
  const currentAnimation = state && state.animation ? state.animation : {}
  const animation = { ...currentAnimation, ...currentProgressState(currentAnimation) }
  const { currentProgress } = animation

  return {
    ...animation,
    ...currentKeyframes({ currentProgress, keyframes, timing })
  }
}

/**
 * The keyframes at a specific point in the animation.
 *
 * @param {Object} options
 * @param {number} options.currentProgress - The animation's current progress.
 * @param {Keyframe[]} options.keyframes - The shape's keyframes.
 * @param {Timing} options.timing
 *
 * @returns {Object}
 *
 * @example
 * currentKeyframes({ 0.5, keyframes, timing })
 */
const currentKeyframes = ({ currentProgress, keyframes, timing }) => {
  const keyframe1Index = timing.reduce((a, b, i) => currentProgress > b ? i : a, 0)
  const keyframe2Index = keyframe1Index + 1
  const keyframe1 = keyframes[ keyframe1Index ]
  const keyframe2 = keyframes[ keyframe2Index ]

  return {
    keyframe1,
    keyframe1Index,
    ...(keyframe2 ? { keyframe2, keyframe2Index } : {})
  }
}

/**
 * The shapes at at specific point in the animation.
 *
 * @param {Object} options
 * @param {Duration} options.duration - Total duration of the tween.
 * @param {function} options.easing - The easing function.
 * @param {FrameShape[]} options.shapes1 - The frame shape to tween from.
 * @param {FrameShape[]} options.shapes2 - The frame shape to tween to.
 * @param {Duration} options.time - Time since the start of the tween.
 *
 * @returns {FrameShape[]}
 *
 * @example
 * currentShapes({ duration, easing, shapes1, shapes2, time })
 */
const currentShapes = ({ duration, easing, shapes1, shapes2, time }) => {
  const [ fromShapes, toShapes ] = normalisedShapes(shapes1, shapes2)

  return fromShapes.map((fromShape, i) => {
    const toShape = toShapes[ i ]
    return tween(fromShape, toShape, time, duration, easing)
  })
}

/**
 * The shapes at a specific point in the animation.
 *
 * @param {AnimationState} animation
 * @param {Timing} timing
 *
 * @returns {FrameShape[]}
 *
 * @example
 * frameShapes(animation, timing)
 */
const frameShapes = (animation, timing) => {
  const {
    currentProgress,
    easing: defaultEasing,
    keyframe1,
    keyframe1Index,
    keyframe2,
    keyframe2Index
  } = animation

  const { shapes: shapes1 } = keyframe1
  const { shapes: shapes2 } = keyframe2 || {}

  if (currentProgress === 0 || !keyframe2) {
    return shapes1
  } else if (currentProgress === 1) {
    return shapes2
  }

  const scale = timing[ keyframe2Index ] - timing[ keyframe1Index ]
  const offset = currentProgress - timing[ keyframe1Index ]
  const duration = animation.duration * scale
  const time = duration * offset / scale
  const easing = easingFunc(keyframe2.animation.easing || defaultEasing)

  return currentShapes({
    currentProgress,
    duration,
    easing,
    shapes1,
    shapes2,
    time
  })
}

/**
 * The motion path offset and angle at a specific point in the animation.
 *
 * @param {AnimationState} animation
 * @param {motionPath} motionPath
 *
 * @returns {Object}
 *
 * @example
 * motionPathOffset(animation, motionPath)
 */
const motionPathOffset = (animation, motionPath) => {
  const { currentProgress, easing: defaultEasing } = animation
  const { accuracy = 1, ...motionPathShape } = motionPath
  const shape = toPoints(motionPathShape)

  const easing = (currentProgress > 0 && currentProgress < 1)
    ? easingFunc(motionPath.easing || defaultEasing)
    : null

  const interval = easing ? easing(currentProgress, 0, 1, 1) : currentProgress

  return position(shape, interval, accuracy)
}

/**
 * Applies a motion path to a set of shapes.
 *
 * @param {AnimationState} animation
 * @param {motionPath} motionPath
 * @param {FrameShape[]} shapes
 *
 * @returns {FrameShape[]}
 *
 * @example
 * motionPathShapes(animation, motionPath, shapes)
 */
const motionPathShapes = (animation, motionPath, shapes) => {
  const { rotate: r = false } = motionPath
  const { angle, x, y } = motionPathOffset(animation, motionPath)
  const a = typeof r === 'number' ? (r + angle) % 360 : angle

  if (x || y) {
    return shapes.map(({ points, ...shape }) => {
      if (points) {
        let p = offset(points, x, y)

        if (r) {
          p = rotate(p, a)
        }

        return { ...shape, points: p }
      }

      return shape
    })
  }

  return shapes
}

/**
 * Normalise two sets of shapes to match point lengths and types.
 *
 * @param {FrameShape[]} shapes1
 * @param {FrameShape[]} shapes2
 *
 * @returns {FrameShape[][]}
 *
 * @example
 * normalisedShapes(shapes1, shapes2)
 */
const normalisedShapes = (shapes1, shapes2) => {
  const a = []
  const b = []

  shapes1.map((shape1, i) => {
    const shape2 = shapes2[ i ]

    const [ s1, s2 ] = shape1.points
      ? normalise(shape1, shape2)
      : [ shape1, shape2 ]

    a.push(s1)
    b.push(s2)
  })

  return [ a, b ]
}

/**
 * The shape's attributes.
 *
 * @param {FrameShape} shape
 *
 * @returns {Object}
 *
 * @example
 * shapeAttributes(shape)
 */
const shapeAttributes = ({ points, styles }) => {
  const attributes = styleAttributes(styles)

  if (points) {
    attributes.d = toPath(points)
  }

  return attributes
}

/**
 * An array of shape's attributes.
 *
 * @param {AnimationState} animation
 * @param {MotionPath[]} motionPaths
 * @param {Timing} timing
 *
 * @returns {Object[]}
 *
 * @example
 * shapeState(animation, motionPaths, timing)
 */
const shapeState = (animation, motionPaths, timing) => {
  const { keyframe2Index } = animation
  const motionPath = motionPaths[ keyframe2Index ]
  const shapes = frameShapes(animation, timing)

  if (motionPath) {
    return motionPathShapes(animation, motionPath, shapes)
      .map(shapeAttributes)
  }

  return shapes.map(shapeAttributes)
}

/**
 * The shape's style attributes.
 *
 * @param {ShapeStyleProps} styles
 *
 * @returns {Object}
 *
 * @example
 * styleAttributes(styles)
 */
const styleAttributes = styles => {
  const attributes = {}

  Object.keys(styles).map(prop => {
    const attribute = stylePropAttrMap[ prop ]

    if (attribute) {
      attributes[ attribute ] = styles[ prop ]
    }
  })

  return attributes
}

export {
  animationState,
  currentKeyframes,
  currentShapes,
  frameShapes,
  motionPathOffset,
  motionPathShapes,
  normalisedShapes,
  shapeAttributes,
  styleAttributes,
  shapeState
}

/**
 * Update the shape's state.
 *
 * @property {Shape} shape
 */
export default shape => {
  const { motionPaths, timing } = shape.timeline

  const animation = animationState(shape)
  const shapes = shapeState(animation, motionPaths, timing)

  shape.state = { animation, shapes }
}
