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
      const f = colorIn( from );
      const t = colorIn( to );

      if ( typeof f === 'object' && typeof t === 'object' ) {
        return colorOut( match( f, t, tween ));
      }
    }

    return from;
  };

  return match( shape1, shape2, tween );
};
