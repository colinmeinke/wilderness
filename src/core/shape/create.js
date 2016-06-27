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

const create = ( initialShape, ...animationShapes ) => {
  const shapes = [
    shapeObj( initialShape, { animation: false }),
    ...animationShapes.map( s => shapeObj({ ...initialShape, ...s })),
  ];

  const duration = addDurations( shapes );

  const shape = {
    duration,
    timeline: timeline( shapes, duration ),
    shapes,
  };

  update( shape );

  return shape;
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

const shapeObj = ( shape, { animation = true } = {}) => {
  const manipulations = filter( manipulationProps, shape );
  const points = toPoints( filter( shapeProps, shape ));

  const obj = {};

  obj.points = manipulate( points, manipulations );
  obj.styles = filter( styleProps, shape );

  if ( animation ) {
    obj.animation = {
      ...animationDefaults,
      ...filter( animationProps, shape ),
    };
  }

  return obj;
};

const timeline = ( shapes, duration ) => {
  let currentDuration = 0;

  return shapes.map(({ animation = null }) => {
    if ( animation ) {
      currentDuration += animation.duration;
      return currentDuration / duration;
    }

    return currentDuration;
  });
};

export {
  addDurations,
  manipulate,
  shapeObj,
  timeline,
};

export default create;
