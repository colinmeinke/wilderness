import { filter } from '../helpers';
import { moveIndex, offset, reverse, scale } from 'points';
import { animationProps, manipulationProps, shapeProps, styleProps } from './props';
import { toPoints } from 'svg-points';

const manipulate = ( points, manipulations ) => {
  Object.keys( manipulations ).forEach( k => {
    const args = manipulations[ k ];

    switch ( k ) {
      case 'moveIndex':
        points = moveIndex( points, args );
        break;

      case 'offset':
        const [ x = 0, y = 0 ] = args;

        points = offset( points, x, y );

        break;

      case 'reverse':
        points = reverse( points );
        break;

      case 'scale':
        const isArray = Array.isArray( args );
        const scaleFactor = isArray ? args[ 0 ] : args;
        const anchor = isArray ? args[ 1 ] : 'center';

        points = scale( points, scaleFactor, anchor );

        break;
    }
  });

  return points;
}

const shapeData = s => {
  const animation = filter( animationProps, s );
  const manipulations = filter( manipulationProps, s );
  const shape = filter( shapeProps, s );
  const styles = filter( styleProps, s );

  const points = manipulate( toPoints( shape ), manipulations );

  return { animation, points, styles };
};

const shape = ( initialShape, ...animationShapes ) => {
  const shapes = [
    shapeData( initialShape ),
    ...animationShapes.map( s => shapeData({ ...initialShape, ...s })),
  ];

  if ( shapes.length > 1 ) {
    console.warn( 'The `shape()` function currently only cares about the initial shape.' );
  }

  return { shapes };
};

export default shape;
