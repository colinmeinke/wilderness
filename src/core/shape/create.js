import {
  animationDefaults,
  animationProps,
  manipulationProps,
  shapeProps,
  styleProps,
} from './props';

import { filter } from '../helpers';
import { moveIndex, offset, reverse, scale } from 'points';
import { toPoints } from 'svg-points';
import update from './update';

const addDurations = shapes => {
  let duration = 0;

  shapes.forEach(({ animation }) => {
    if ( animation ) {
      duration += animation.duration;
    }
  });

  return duration;
};

const create = ( initialShape, ...additionalShapes ) => {
  const shapes = [ initialShape ].concat(
    additionalShapes.map( shape => {
      const s = { ...initialShape, ...shape };

      if ( initialShape.type === 'g' ) {
        s.shapes = shape.shapes.map(( x, i ) => {
          return { ...initialShape.shapes[ i ], ...x };
        });
      }

      return s;
    })
  );

  const keyframes = shapes.map( keyframe );
  const duration = addDurations( keyframes );

  return update({
    timeline: {
      duration,
      keyframes,
      timing: timing( keyframes, duration ),
    },
    state: {
      animation: {},
      shapes: [],
    },
  });
};

const keyframe = ({ shapes, ...shape }, i ) => {
  const s = [ shape ];

  if ( shapes ) {
    shapes.map( x => s.push( x ));
  }

  const k = { shapes: s.map( keyframeShape )};

  if ( i > 0 ) {
    k.animation = {
      ...animationDefaults,
      ...filter( animationProps, shape ),
    };
  }

  return k;
};

const keyframeShape = shape => {
  const k = { styles: filter( styleProps, shape )};

  if ( shape.type !== 'g' ) {
    const manipulations = filter( manipulationProps, shape );
    const points = toPoints( filter( shapeProps, shape ));
    k.points = manipulate( points, manipulations );
  }

  return k;
};

const manipulate = ( points, manipulations ) => {
  let p = [ ...points ];

  Object.keys( manipulations ).forEach( k => {
    const args = manipulations[ k ];

    switch ( k ) {
      case 'moveIndex':
        p = moveIndex( p, args );
        break;

      case 'offset':
        const [ x = 0, y = 0 ] = args;

        p = offset( p, x, y );

        break;

      case 'reverse':
        p = reverse( p );
        break;

      case 'scale':
        const isArray = Array.isArray( args );
        const scaleFactor = isArray ? args[ 0 ] : args;
        const anchor = isArray ? args[ 1 ] : 'center';

        p = scale( p, scaleFactor, anchor );

        break;
    }
  });

  return p;
};

const timing = ( keyframes, duration ) => {
  let currentDuration = 0;

  return keyframes.map(({ animation }) => {
    if ( animation ) {
      currentDuration += animation.duration;
      return currentDuration / duration;
    }

    return currentDuration;
  });
};

export {
  addDurations,
  keyframe,
  keyframeShape,
  manipulate,
  timing,
};

export default create;
