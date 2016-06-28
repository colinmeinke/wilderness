import { add, cubify, remove } from 'points';

const addCurves = ( a, b ) => {
  const c = [];

  for ( let i = 0, l = a.length; i < l; i++ ) {
    if ( !a[ i ].curve && b[ i ].curve ) {
      c.push({ ...a[ i ], curve: {
        type: 'cubic',
        x1: a[ i - 1 ].x,
        y1: a[ i - 1 ].y,
        x2: a[ i ].x,
        y2: a[ i ].y,
      }});
    } else {
      c.push( a[ i ]);
    }
  }

  return c;
}

const normaliseCurves = ( a, b ) => ([ addCurves( a, b ), addCurves( b, a )]);

const normalisePoints = ( a, b ) => {
  let c = cubify( remove( a ));
  let d = cubify( remove( b ));

  if ( d.length > c.length ) {
    c = add( c, d.length );
  } else if ( c.length > d.length ) {
    d = add( d, c.length );
  }

  return normaliseCurves( c, d );
};

const normalise = ( a, b ) => {
  const [ c, d ] = normalisePoints( a.points, b.points );
  return [{ ...a, points: c }, { ...b, points: d }];
};

export default normalise;
