import { currentState, easingFunc, normalise, tween } from '../helpers';
import { stylePropAttrMap } from './props';
import { toPath } from 'svg-points';

const currentAttributes = shape => {
  const { points, styles } = shape;
  const a = { d: toPath( points )};

  Object.keys( styles ).forEach( prop => {
    const attr = stylePropAttrMap[ prop ];

    if ( attr ) {
      a[ attr ] = styles[ prop ];
    }
  });

  return a;
};

const currentShape = ({ shapes, state, timeline }) => {
  const { animation = {}, progress } = state;
  const shapesLength = shapes.length;

  if ( progress === 0 || shapesLength === 1 ) {
    return shapes[ 0 ];
  } else if ( progress === 1 ) {
    return shapes[ shapesLength - 1 ];
  }

  const s1Index = timeline.reduce(( a, b, i ) => progress >= b ? i : a, 0 );
  const s2Index = s1Index + 1;
  const s1 = shapes[ s1Index ];
  const s2 = shapes[ s2Index ];
  const [ shape1, shape2 ] = normalise( s1, s2 );

  const scale = timeline[ s2Index ] - timeline[ s1Index ];
  const offset = progress - timeline[ s1Index ];
  const duration = animation.duration * scale;
  const time = duration * offset / scale;

  const easing = animation.easing || shape2.animation.easing;
  const ease = typeof easing === 'function' ? easing : easingFunc( easing );

  return tween( shape1, shape2, time, duration, ease );
};

const update = shape => {
  shape.state = shape.state || {};

  if ( shape.state.animation ) {
    const { currentProgress } = currentState( shape.state.animation );
    shape.state.progress = currentProgress;
  } else {
    shape.state.progress = 0;
  }

  shape.state.attributes = currentAttributes( currentShape( shape ));
};

export { currentAttributes, currentShape };
export default update;
