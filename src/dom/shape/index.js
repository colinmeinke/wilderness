import { createShape, updateShape } from '../../core';

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

const create = ( ...args ) => {
  const shape = createShape( ...args );
  createNode( shape );
  return shape;
};

export { update };
export default create;
