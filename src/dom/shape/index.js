import { createShape, updateShape } from '../../core';
import { stylePropAttrMap } from '../../core/shape/props';

const attrMap = { ...stylePropAttrMap };
const attrKeys = Object.keys( attrMap );
const attrValues = attrKeys.map( k => attrMap[ k ]);

const shapeFromNode = node => {
  const { attributes, nodeName: type } = node;
  const shape = { type };

  Object.keys( attributes ).map( k => {
    let { name, value } = attributes[ k ];

    const i = attrValues.indexOf( name );

    if ( i > -1 ) {
      name = attrKeys[ i ];
    }

    shape[ name ] = isNaN( value ) ? value : parseFloat( value );
  });

  if ( type === 'g' ) {
    shape.shapes = [ ...node.children ].map( shapeFromNode );
  }

  return shape;
};

const shapeFromSelector = selector => {
  if ( !selector ) {
    return {};
  }

  const node = document.querySelector( selector );

  return shapeFromNode( node );
};

const createNodes = shape => {
  shape.state.nodes = shape.state.shapes.map(({ d }) => {
    if ( d ) {
      return document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
    }

    return document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
  });

  updateNodes( shape );
};

const updateNodes = ({ state }) => {
  const { nodes, shapes } = state;

  nodes.map(( n, i ) => {
    const shape = shapes[ i ];

    Object.keys( shape ).forEach( key => {
      n.setAttribute( key, shape[ key ]);
    });
  });
};

const update = shape => {
  updateShape( shape );
  updateNodes( shape );
};

const create = ( ...shapes ) => {
  const s = shapes.map(({ selector, ...props }) => {
    return { ...shapeFromSelector( selector ), ...props };
  });

  const shape = createShape( s );

  if ( shapes[ 0 ].selector ) {
    shape.selector = shapes[ 0 ].selector;
  }

  createNodes( shape );

  return shape;
};

export { update };
export default create;
