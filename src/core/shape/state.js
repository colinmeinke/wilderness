import { currentState, easingFunc, normalise, tween } from '../helpers';
import { stylePropAttrMap } from './props';
import { toPath } from 'svg-points';

const currentKeyframes = ( currentProgress, keyframes, timing ) => {
  const keyframe1Index = timing.reduce(( a, b, i ) => currentProgress > b ? i : a, 0 );
  const keyframe2Index = keyframe1Index + 1;
  const keyframe1 = keyframes[ keyframe1Index ];
  const keyframe2 = keyframes[ keyframe2Index ];

  return { keyframe1, keyframe1Index, keyframe2, keyframe2Index };
};

const frameShapes = ({
  currentProgress,
  duration,
  easing,
  keyframe1,
  keyframe2,
  time,
}) => {
  if ( currentProgress === 0 || !keyframe2 ) {
    return keyframe1.shapes;
  } else if ( currentProgress === 1 ) {
    return keyframe2.shapes;
  }

  const [ shapes1, shapes2 ] = shapes( keyframe1, keyframe2 );

  return shapes1.map(( s1, i ) => {
    const s2 = shapes2[ i ];
    return tween( s1, s2, time, duration, easing );
  });
};

const shapeAttributes = ({ points, styles }) => {
  const attributes = styleAttributes( styles );

  if ( points ) {
    attributes.d = toPath( points );
  }

  return attributes;
};

const shapes = ( keyframe1, keyframe2 ) => {
  const shapes1 = [];
  const shapes2 = [];

  keyframe1.shapes.map(( shape1, i ) => {
    const shape2 = keyframe2.shapes[ i ];

    const [ s1, s2 ] = shape1.points ?
      normalise( shape1, shape2 ) :
      [ shape1, shape2 ];

    shapes1.push( s1 );
    shapes2.push( s2 );
  });

  return [ shapes1, shapes2 ];
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

const state = shape => {
  const { keyframes, timing } = shape.timeline;

  const currentAnimation = shape.state && shape.state.animation ?
    shape.state.animation : {};

  const animation = { ...currentAnimation, ...currentState( currentAnimation )};
  const { currentProgress } = animation;

  const {
    keyframe1,
    keyframe1Index,
    keyframe2,
    keyframe2Index,
  } = currentKeyframes( currentProgress, keyframes, timing );

  const scale = timing[ keyframe2Index ] - timing[ keyframe1Index ];
  const offset = currentProgress - timing[ keyframe1Index ];
  const duration = animation.duration * scale;
  const time = duration * offset / scale;
  const easing = keyframe2.animation.easing || animation.easing;

  const shapes = frameShapes({
    currentProgress,
    duration,
    easing: typeof easing === 'function' ? easing : easingFunc( easing ),
    keyframe1,
    keyframe2,
    time,
  }).map( shapeAttributes );

  const state = {
    animation: { ...animation, keyframe1Index, keyframe2Index },
    shapes,
  };

  shape.state = state;

  return state;
};

export {
  currentKeyframes,
  frameShapes,
  shapeAttributes,
  shapes,
  styleAttributes,
};

export default state;
