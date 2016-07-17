import { create as coreCreate, state } from '../../core';
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

const create = shapes => {
  const s = shapes.map(({ selector, ...props }) => ({
    ...shapeFromSelector( selector ),
    ...props,
  }));

  return {
    selector: shapes[ 0 ].selector,
    ...coreCreate( s ),
  };
};

export { create };

export default ( ...shapes ) => {
  const shape = create( shapes );
  state( shape );
  return shape;
};;
