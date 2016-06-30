import { createShape, updateShape } from '../../core';
import { stylePropAttrMap } from '../../core/shape/props';

const attrMap = { ...stylePropAttrMap };
const attrKeys = Object.keys( attrMap );
const attrValues = attrKeys.map( k => attrMap[ k ]);

const shapeFromDom = selector => {
  if ( !selector ) {
    return {};
  }

  const { attributes, nodeName: type } = document.querySelector( selector );
  const shape = { type };

  Object.keys( attributes ).map( k => {
    let { name, value } = attributes[ k ];

    const i = attrValues.indexOf( name );

    if ( i > -1 ) {
      name = attrKeys[ i ];
    }

    shape[ name ] = isNaN( value ) ? value : parseFloat( value );
  });

  return shape;
};

const createNode = shape => {
  shape.state.node = document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
  updateNode( shape );
};

const updateNode = ({ state }) => {
  Object.keys( state.attributes ).forEach( key => {
    state.node.setAttribute( key, state.attributes[ key ]);
  });
};

const update = shape => {
  updateShape( shape );
  updateNode( shape );
};

const create = ( ...shapes ) => {
  const s = shapes.map(({ selector, ...props }) => {
    return { ...shapeFromDom( selector ), ...props };
  });

  const shape = createShape( ...s );

  if ( shapes[ 0 ].selector ) {
    shape.selector = shapes[ 0 ].selector;
  }

  createNode( shape );

  return shape;
};

export { update };
export default create;
