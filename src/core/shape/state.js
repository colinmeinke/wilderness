import { currentState, easingFunc, normalise, tween } from '../helpers';
import { offset, position, rotate } from 'points';
import { stylePropAttrMap } from './props';
import { toPath, toPoints } from 'svg-points';

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

const currentShapes = ({ duration, easing, shapes1, shapes2, time }) => {
  const [ s1, s2 ] = normalisedShapes( shapes1, shapes2 );

  return s1.map(( a, i ) => {
    const b = s2[ i ];
    return tween( a, b, time, duration, easing );
  });
};

const frameShapes = ( animation, timing ) => {
  const {
    currentProgress,
    easing: defaultEasing,
    keyframe1,
    keyframe1Index,
    keyframe2,
    keyframe2Index,
  } = animation;

  const { shapes: shapes1 } = keyframe1;
  const { shapes: shapes2 } = keyframe2 || {};

  if ( currentProgress === 1 || !keyframe2 ) {
    return shapes1;
  } else if ( currentProgress === 0 ) {
    return shapes2;
  }

  const scale = timing[ keyframe2Index ] - timing[ keyframe1Index ];
  const offset = currentProgress - timing[ keyframe1Index ];
  const duration = animation.duration * scale;
  const time = duration * offset / scale;
  const easing = easingFunc( keyframe2.animation.easing, defaultEasing );

  return currentShapes({
    currentProgress,
    duration,
    easing,
    shapes1,
    shapes2,
    time,
  });
};

const motionPathOffset = ( animation, motionPath ) => {
  const { currentProgress, easing: defaultEasing } = animation;
  const { accuracy = 1, ...motionPathShape } = motionPath;
  const shape = toPoints( motionPathShape );

  const easing = ( currentProgress > 0 && currentProgress < 1 ) ?
    easingFunc( motionPath.easing, defaultEasing ) : null;

  const interval = easing ? easing( currentProgress, 0, 1, 1 ) : currentProgress;

  return position( shape, interval, accuracy );
};

const motionPathShapes = ( animation, motionPath, shapes ) => {
  const { rotate: r = false } = motionPath;
  const { angle, x, y } = motionPathOffset( animation, motionPath );

  if ( x || y ) {
    return shapes.map(({ points, ...shape }) => {
      if ( points ) {
        let p = offset( points, x, y );

        if ( r ) {
          p = rotate( p, angle );
        }

        return { ...shape, points: p };
      }

      return shape;
    });
  }

  return shapes;
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

const shapeState = ( animation, motionPaths, timing ) => {
  const { keyframe2Index } = animation;
  const motionPath = motionPaths[ keyframe2Index ];
  const shapes = frameShapes( animation, timing );

  if ( motionPath ) {
    return motionPathShapes( animation, motionPath, shapes )
      .map( shapeAttributes );
  }

  return shapes.map( shapeAttributes );
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
  shapeState,
};

export default shape => {
  const { state, timeline } = shape;
  const { motionPaths, timing } = timeline;
  const animation = animationState( state, timeline );
  const shapes = shapeState( animation, motionPaths, timing );
  const s = { animation, shapes };

  shape.state = s;

  return s;
};
