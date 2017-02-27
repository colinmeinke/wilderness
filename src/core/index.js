/**
 * The current progress of a shape's animation.
 *
 * @typedef {Object} AnimationProgressState
 *
 * @property {number} currentProgress - The animation's current progress.
 * @property {boolean} currentReverse - Is the animation currently in reverse?
 * @property {number} iterationsComplete - The amount of iterations the animation has completed.
 */

/**
 * Instructions on how to animate from a previous state.
 *
 * @typedef {Object} AnimationProps
 *
 * @property {Duration} [delay] - The duration to wait before the animation plays.
 * @property {Duration} [duration] - The duration of one iteration of the animation.
 * @property {(function|string)} [easing] - An easing function or the name of an easing function from https://github.com/chenglou/tween-functions.
 * @property {function} [finish] - A function that is called when the animation finishes.
 * @property {MotionPath} [motionPath]
 * @property {string} [name] - Used to reference this animation.
 * @property {function} [start] - A function that is called when the animation starts.
 * @property {function} [update] - A function that is called every time the animation updates.
 */

/**
 * The current state of a shape's animation.
 *
 * @typedef {Object} AnimationState
 *
 * @extends AnimationProgressState
 * @property {boolean} alternate - Does the animation alternate direction on each iteration?
 * @property {Duration} duration - The duration of one iteration of the animation.
 * @property {function} easing - The easing function.
 * @property {function} finish - The function to call on animation finish.
 * @property {boolean} finished - Has the animation finished?
 * @property {float} initialProgress - The progress the animation started with.
 * @property {number} iterations - The total iterations to play.
 * @property {Keyframe} keyframe1 - The first keyframe that the animaton is currently between.
 * @property {integer} keyframe1Index - The index of the first keyframe that the animaton is currently between.
 * @property {Keyframe} keyframe2 - The second keyframe that the animaton is currently between.
 * @property {integer} keyframe2Index - The index of the second keyframe that the animaton is currently between.
 * @property {KeyframesState} keyframes
 * @property {integer} pause - The timestamp that the animation paused.
 * @property {integer} play - The timestamp that the animation started.
 * @property {boolean} reverse – Does the animation start in reverse?
 * @property {function} start - The function to call on animation start.
 * @property {boolean} started - Has the animation started playback?
 * @property {function} update - The function to call on animation update.
 */

/**
 * The number of milliseconds.
 *
 * @typedef {number} Duration
 */

/**
 * Shape and style data for a single shape.
 *
 * @typedef {Object} FrameShape
 *
 * @property {ShapeStyleProps} styles
 * @property {Points} [points]
 */

/**
 * A keyframe is made up of one or more shapes, and the animation data required
 * to calculate the transition from the previous keyframe.
 *
 * @typedef {Object} Keyframe
 *
 * @property {Animation} [animation] - The keyframe's animation properties.
 * @property {FrameShape[]} shapes - All of the keyframe's shapes.
 */

/**
 * The current state of the shape's keyframes.
 *
 * @typedef {KeyframeState[]} KeyframesState
 */

/**
 * The current state of a single keyframe.
 *
 * @typedef {Object} KeyframeState
 *
 * @property {boolean} finished - Has the keyframe finished playing?
 * @property {boolean} reverse - Is the keyframe playing in reverse?
 * @property {boolean} started - Has the keyframe started playing?
 */

/**
 * The data required to calculate a non-linear transition between two keyframes.
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
 * An SVG shape, its associated style and instructions on how to animate to it
 * from a previous shape.
 *
 * @typedef {Object} PlainShapeObject
 *
 * @extends ShapeCoreProps
 * @extends ShapeManipulationProps
 * @extends ShapeStyleProps
 * @extends AnimationProps
 */

/**
 * A shape.
 *
 * @typedef {Shape} Playable
 */

/**
 * Shape data as defined by https://github.com/colinmeinke/points.
 *
 * @typedef {Object[]} Points
 */

/**
 * A shape that can have multiple states over time.
 *
 * @typedef {Object} Shape
 *
 * @property {State} state
 * @property {Timeline} timeline
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
 * The current state of a shape's shapes.
 *
 * @typedef {Object} ShapesState
 *
 * @property ...
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
 * The current state of a shape.
 *
 * @typedef {Object} State
 *
 * @property {AnimationState} animation
 * @property {ShapesState} shapes
 */

/**
 * Shape and animation data required to calculate the state of the shape at any
 * point in time.
 *
 * @typedef {Object} Timeline
 *
 * @property {Duration} duration - The duration of one iteration of the animation.
 * @property {Keyframe[]} keyframes - The shape's keyframes.
 * @property {(MotionPath|undefined)[]} motionPaths - A map of keyframe motion paths.
 * @property {Timing} timing
 */

/**
 * A map of keyframe animation start intervals.
 *
 * @typedef {number[]} Timing
 */

import pause from './pause'
import play, { tick } from './play'
import shape, { create, state } from './shape'

export { create, pause, play, shape, state, tick }
