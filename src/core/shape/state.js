import { currentState, easingFunc, normalise, tween } from '../helpers';
import { stylePropAttrMap } from './props';
import { toPath } from 'svg-points';

const animationState = ( state, timeline ) => {
  const { keyframes, timing } = timeline;
  const currentAnimation = state && state.animation ? state.animation : {};
  const animation = { ...currentAnimation, ...currentState( currentAnimation )};
  const { currentProgress } = animation;

  return {
    ...animation,
    ...currentKeyframes( currentProgress, keyframes, timing ),
  };
};

const currentKeyframes = ( currentProgress, keyframes, timing ) => {
  const keyframe1Index = timing.reduce(( a, b, i ) => currentProgress > b ? i : a, 0 );
  const keyframe2Index = keyframe1Index + 1;
  const keyframe1 = keyframes[ keyframe1Index ];
  const keyframe2 = keyframes[ keyframe2Index ];

  return { keyframe1, keyframe1Index, keyframe2, keyframe2Index };
};

const currentShapes = ({
  currentProgress,
  duration,
  easing,
  shapes1,
  shapes2,
  time,
}) => {
  const [ s1, s2 ] = normalisedShapes( shapes1, shapes2 );

  return s1.map(( a, i ) => {
    const b = s2[ i ];
    return tween( a, b, time, duration, easing );
  });
};

const normalisedShapes = ( shapes1, shapes2 ) => {
  const a = [];
  const b = [];

  shapes1.map(( shape1, i ) => {
    const shape2 = shapes2[ i ];

    const [ s1, s2 ] = shape1.points ?
      normalise( shape1, shape2 ) :
      [ shape1, shape2 ];

    a.push( s1 );
    b.push( s2 );
  });

  return [ a, b ];
};

const shapeAttributes = ({ points, styles }) => {
  const attributes = styleAttributes( styles );

  if ( points ) {
    attributes.d = toPath( points );
  }

  return attributes;
};

const styleAttributes = styles => {
  const s = {};

  Object.keys( styles ).map( prop => {
    const attr = stylePropAttrMap[ prop ];

    if ( attr ) {
      s[ attr ] = styles[ prop ];
    }
  });

  return s;
};

const shapes = ( animation, timing ) => {
  const {
    currentProgress,
    easing: defaultEasing,
    keyframe1,
    keyframe1Index,
    keyframe2,
    keyframe2Index,
  } = animation;

  if ( currentProgress === 0 || !keyframe2 ) {
    return keyframe1.shapes;
  } else if ( currentProgress === 1 ) {
    return keyframe2.shapes;
  }

  const scale = timing[ keyframe2Index ] - timing[ keyframe1Index ];
  const offset = currentProgress - timing[ keyframe1Index ];
  const duration = animation.duration * scale;
  const time = duration * offset / scale;
  const easing = keyframe2.animation.easing || defaultEasing;

  return currentShapes({
    currentProgress,
    duration,
    easing: typeof easing === 'function' ? easing : easingFunc( easing ),
    shapes1: keyframe1.shapes,
    shapes2: keyframe2.shapes,
    time,
  });
};

export {
  animationState,
  currentKeyframes,
  currentShapes,
  normalisedShapes,
  shapeAttributes,
  shapes,
};

export default shape => {
  const { state, timeline } = shape;
  const { timing } = timeline;

  const animation = animationState( state, timeline );

  const s = {
    animation,
    shapes: shapes( animation, timing ).map( shapeAttributes ),
  };

  shape.state = s;

  return s;
};
