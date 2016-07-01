import { colorIn, colorOut } from './color';
import match from './match';
import { unitsIn, unitsOut } from './units';

const middleware = [
  { name: 'color', i: colorIn, o: colorOut },
  { name: 'units', i: unitsIn, o: unitsOut },
];

export default ( shape1, shape2, time, duration, ease ) => {
  const tween = ( from, to ) => {
    if ( from === to ) {
      return from;
    }

    if ( typeof from === 'number' && typeof to === 'number' ) {
      return ease( time, from, to, duration );
    }

    let f = from;
    let t = to;

    middleware.map(({ i }) => {
      if ( typeof f === 'string' && typeof t === 'string' ) {
        f = i( f );
        t = i( t );
      }
    });

    if ( typeof f === 'object' && typeof t === 'object' ) {
      for ( let i in middleware ) {
        const { name, o } = middleware[ i ];

        if ( name === f.middleware && name === t.middleware ) {
          return o( match( f, t, tween ));
        }
      }
    }

    return from;
  };

  return match( shape1, shape2, tween );
};
