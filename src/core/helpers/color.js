const range = ( value, min, max ) => Math.max( min, Math.min( max, value ));

const isHexStr = v => v.match( /^#(?:[0-9a-f]{3}){1,2}$/i ) !== null;
const isRgbStr = v => v.startsWith( 'rgb(' );
const isRgbaStr = v => v.startsWith( 'rgba(' );

const isHexObj = v => typeof v === 'object' && v.colorType === 'hex';
const isRgbObj = v => typeof v === 'object' && v.colorType === 'rgb';
const isRgbaObj = v => typeof v === 'object' && v.colorType === 'rgba';

const hexToObj = hex => {
  let value = hex.replace( '#', '' );

  if ( value.length === 3 ) {
    value = value.split( '' ).map( v => `${ v }${ v }` ).join( '' );
  }

  return {
    colorType: 'hex',
    r: parseInt( value.slice( 0, 2 ), 16 ),
    g: parseInt( value.slice( 2, 4 ), 16 ),
    b: parseInt( value.slice( 4, 6 ), 16 ),
    a: 1,
  };
};

const rgbToObj = v => {
  const rgb = v.replace( /\s/g, '' );

  const [ r, g, b ] = rgb.substring( 4, rgb.length - 1 ).split( ',' );

  return {
    colorType: 'rgb',
    r: parseFloat( r ),
    g: parseFloat( g ),
    b: parseFloat( b ),
    a: 1,
  };
};

const rgbaToObj = v => {
  const rgba = v.replace( /\s/g, '' );

  const [ r, g, b, a ] = rgba.substring( 5, rgba.length - 1 ).split( ',' );

  return {
    colorType: 'rgba',
    r: parseFloat( r ),
    g: parseFloat( g ),
    b: parseFloat( b ),
    a: parseFloat( a ),
  };
};

const objToHex = obj => {
  let r = Math.ceil( range( obj.r, 0, 255 )).toString( 16 );
  let g = Math.ceil( range( obj.g, 0, 255 )).toString( 16 );
  let b = Math.ceil( range( obj.b, 0, 255 )).toString( 16 );

  r = r.length === 1 ? `0${ r }` : r;
  g = g.length === 1 ? `0${ g }` : g;
  b = b.length === 1 ? `0${ b }` : b;

  return `#${ r }${ g }${ b }`;
}

const objToRgb = ({ r, g, b }) => `rgb(${ range( r, 0, 255 )},${ range( g, 0, 255 )},${ range( b, 0, 255 )})`;

const objToRgba = ({ r, g, b, a }) => `rgba(${ range( r, 0, 255 )},${ range( g, 0, 255 )},${ range( b, 0, 255 )},${ range( a, 0, 1 )})`;

const colorIn = v => {
  if ( isHexStr( v )) {
    return hexToObj( v );
  } else if ( isRgbStr( v )) {
    return rgbToObj( v );
  } else if ( isRgbaStr( v )) {
    return rgbaToObj( v );
  }

  return v;
};

const colorOut = v => {
  if ( isRgbaObj( v )) {
    return objToRgba( v );
  } else if ( isHexObj( v )) {
    return objToHex( v );
  } else if ( isRgbObj( v )) {
    return objToRgb( v );
  }

  return v;
};

export { colorIn, colorOut };
