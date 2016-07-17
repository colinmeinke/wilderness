import create from './create';
import events from './events';
import state from './state';

export { create, events, state };

export default ( ...shapes ) => {
  const shape = create( shapes );
  state( shape );
  return shape;
};
