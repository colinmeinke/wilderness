import { toPath } from 'svg-points';
import { shape } from '../../core';

const stylePropAttrMap = {
  fill: 'fill',
  fillOpactity: 'fill-opacity',
  fillRule: 'fill-rule',
  stroke: 'stroke',
  strokeDasharray: 'stroke-dasharray',
  strokeDashoffset: 'stroke-dashoffset',
  strokeLinecap: 'stroke-linecap',
  strokeLinejoin: 'stroke-linejoin',
  strokeOpactity: 'stroke-opacity',
  strokeWidth: 'stroke-width',
  vectorEffect: 'vector-effect',
};

const node = ([ shp ]) => {
  if ( shp ) {
    const { points, styles } = shp;
    const path = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );

    path.setAttribute( 'd', toPath( points ));

    Object.keys( styles ).forEach( prop => {
      const attr = stylePropAttrMap[ prop ];

      if ( attr ) {
        path.setAttribute( attr, styles[ prop ]);
      }
    });

    return path;
  }

  return null;
};

export default ( ...args ) => {
  const shp = shape( ...args );
  shp.node = node( shp.shapes );
  return shp;
};
