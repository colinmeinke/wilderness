import { currentState, easingFunc, finished, normalise, tween } from '../helpers';
import { stylePropAttrMap } from './props';
import { toPath } from 'svg-points';

const currentKeyframeIndex = ( currentProgress, keyframe2Index ) => {
  if ( currentProgress > 0 && currentProgress < 1 ) {
    return keyframe2Index;
  }

  return null;
};

const currentKeyframes = ( currentProgress, keyframes, timing ) => {
  const keyframe1Index = timing.reduce(( a, b, i ) => currentProgress > b ? i : a, 0 );
  const keyframe2Index = keyframe1Index + 1;
  const keyframe1 = keyframes[ keyframe1Index ];
  const keyframe2 = keyframes[ keyframe2Index ];

  return { keyframe1, keyframe1Index, keyframe2, keyframe2Index };
};

const events = ({
  animation,
  keyframe1Index,
  keyframe2Index,
  keyframes,
}) => {
  const { alternate, currentProgress, currentReverse, iterationsComplete } = animation;

  const c = currentKeyframeIndex( currentProgress, keyframe2Index );

  const p = previousKeyframeIndex({
    alternate,
    currentProgress,
    currentReverse,
    iterationsComplete,
    keyframe1Index,
    keyframe2Index,
    keyframeLength: keyframes.length,
  });

  if ( p ) {
    if ( p !== c || animation.keyframes[ p ].reverse !== currentReverse ) {
      if ( animation.keyframes[ p ].started && !animation.keyframes[ p ].finished ) {
        animation.keyframes[ p ].started = false;
        animation.keyframes[ p ].finished = true;

        if ( typeof keyframes[ p ].animation.finish === 'function' ) {
          keyframes[ p ].animation.finish();
        }
      }
    }
  }

  if ( c ) {
    if ( !animation.keyframes[ c ].started ) {
      animation.keyframes[ c ].started = true;
      animation.keyframes[ c ].finished = false;
      animation.keyframes[ c ].reverse = currentReverse;

      if ( typeof keyframes[ c ].animation.start === 'function' ) {
        keyframes[ c ].animation.start();
      }
    }

    if ( typeof keyframes[ c ].animation.update === 'function' ) {
      keyframes[ c ].animation.update();
    }
  }

  if ( typeof animation.update === 'function' ) {
    animation.update();
  }

  if ( finished( animation )) {
    animation.finished = true;

    if ( typeof animation.finish === 'function' ) {
      animation.finish();
    }
  }
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

const previousKeyframeIndex = ({
  alternate,
  currentProgress,
  currentReverse,
  iterationsComplete,
  keyframe1Index,
  keyframe2Index,
  keyframeLength,
}) => {
  if ( currentReverse ) {
    if ( currentProgress === 0 ) {
      return keyframe2Index;
    }

    if ( keyframe2Index + 1 === keyframeLength ) {
      if ( iterationsComplete > 1 ) {
        if ( alternate ) {
          return keyframe2Index;
        }

        return 1;
      }

      return null;
    }

    return keyframe2Index + 1;
  }

  if ( currentProgress === 1 ) {
    return keyframe2Index;
  }

  if ( keyframe1Index === 0 ) {
    if ( iterationsComplete > 1 ) {
      if ( alternate ) {
        return 1;
      }

      return keyframeLength - 1;
    }

    return null;
  }

  return keyframe1Index;
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

const update = shape => {
  const { state, timeline } = shape;
  const { keyframes, timing } = timeline;

  state.animation = { ...state.animation, ...currentState( state.animation )};

  const { animation } = state;
  const { currentProgress, started } = animation;

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

  state.shapes = frameShapes({
    currentProgress,
    duration,
    easing: typeof easing === 'function' ? easing : easingFunc( easing ),
    keyframe1,
    keyframe2,
    time,
  }).map( shapeAttributes );

  if ( started ) {
    events({ animation, keyframe1Index, keyframe2Index, keyframes });
  }

  return shape;
};

export {
  currentKeyframeIndex,
  currentKeyframes,
  events,
  frameShapes,
  previousKeyframeIndex,
  shapeAttributes,
  shapes,
  styleAttributes,
};

export default update;
