import { currentState, easingFunc, normalise, tween } from '../helpers';
import { stylePropAttrMap } from './props';
import { toPath } from 'svg-points';

const frame = ({ state, timeline }) => {
  const { animation } = state;
  const { currentProgress } = animation;
  const { keyframes, timing } = timeline;

  const keyframesLength = keyframes.length;

  if ( currentProgress === 0 || keyframesLength === 1 ) {
    return keyframes[ 0 ].shapes;
  } else if ( currentProgress === 1 ) {
    return keyframes[ keyframesLength - 1 ].shapes;
  }

  const keyframe1 = timing.reduce(( a, b, i ) => currentProgress >= b ? i : a, 0 );
  const keyframe2 = keyframe1 + 1;

  const s1 = keyframes[ keyframe1 ];
  const s2 = keyframes[ keyframe2 ];

  const shapes1 = [];
  const shapes2 = [];

  s1.shapes.map(( s, i ) => {
    const [ shape1, shape2 ] =
      s.points ? normalise( s, s2.shapes[ i ]) : [ s, s2.shapes[ i ]];

    shapes1.push( shape1 );
    shapes2.push( shape2 );
  });

  const scale = timing[ keyframe2 ] - timing[ keyframe1 ];
  const offset = currentProgress - timing[ keyframe1 ];
  const duration = animation.duration * scale;
  const time = duration * offset / scale;
  const easing = s2.animation.easing || animation.easing;
  const ease = typeof easing === 'function' ? easing : easingFunc( easing );

  return shapes1.map(( s, i ) => (
    tween( s, shapes2[ i ], time, duration, ease )
  ));
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

const update = shape => {
  const { state } = shape;
  const animation = currentState( state.animation );
  state.animation = { ...state.animation, ...animation };
  state.shapes = frame( shape ).map( shapeAttributes );
  return shape;
};

export { frame, shapeAttributes, styleAttributes };
export default update;
