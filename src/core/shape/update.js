import { currentState, easingFunc, match, normalise } from '../helpers';
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
  const { duration } = animation;
  const shapesLength = shapes.length;

  if ( progress === 0 || shapesLength === 1 ) {
    return shapes[ 0 ];
  } else if ( progress === 1 ) {
    return shapes[ shapesLength - 1 ];
  }

  const shape1Index = timeline.reduce(( a, b, i ) => progress >= b ? i : a, 0 );
  const shape2Index = shape1Index + 1;
  const shape1 = shapes[ shape1Index ];
  const shape2 = shapes[ shape2Index ];
  const easing = animation.easing || shape2.animation.easing;
  const scale = timeline[ shape2Index ] - timeline[ shape1Index ];
  const offset = progress - timeline[ shape1Index ];
  const d = duration * scale;
  const t = d * offset / scale;
  const ease = typeof easing === 'function' ? easing : easingFunc( easing );

  const [ s1, s2 ] = normalise( shape1, shape2 );

  return match( s1, s2, ( b, e ) => b === e ? b : ease( t, b, e, d ));
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
