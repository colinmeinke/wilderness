import { finished, paused } from '../../core/helpers';
import { play } from '../../core';
import { update as updateShape } from '../shape';

const tick = playable => {
  const { state } = playable;
  const { animation } = state;

  updateShape( playable );

  if ( !paused( animation ) && !finished( animation )) {
    window.requestAnimationFrame(() => {
      tick( playable );
    });
  }
};

export default ( playable, options ) => {
  play( playable, options );
  tick( playable );
};
