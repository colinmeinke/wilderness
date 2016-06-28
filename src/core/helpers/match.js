const match = ( a, b, f ) => {
  if ( Array.isArray( a ) && Array.isArray( b )) {
    const result = [];

    for ( let i = 0, l = a.length; i < l; i++ ) {
      result.push( match( a[ i ], b[ i ], f ));
    }

    return result;
  } else if ( typeof a === 'object' && typeof b === 'object' && a !== null && b !== null ) {
    const result = {};

    for ( let k of Object.keys( a )) {
      result[ k ] = match( a[ k ], b[ k ], f );
    }

    return result;
  }

  return f( a, b );
}

export default match;
