import { colorIn, colorOut } from './color';
import match from './match';

export default ( shape1, shape2, time, duration, ease ) => {
  const tween = ( from, to ) => {
    if ( from === to ) {
      return from;
    }

    if ( typeof from === 'number' && typeof to === 'number' ) {
      return ease( time, from, to, duration );
    } else if ( typeof from === 'string' && typeof to === 'string' ) {
      return colorOut(
        match( colorIn( from ), colorIn( to ), tween )
      );
    }

    return from;
  };

  return match( shape1, shape2, tween );
};
