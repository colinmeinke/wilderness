import { finished, paused } from '../../core/helpers';
import { play } from '../../core';
import { update as updateShape } from '../shape';

const tick = playable => {
  const { state } = playable;
  const { animation } = state;

  if ( !paused( animation ) && !finished( animation )) {
    updateShape( playable );

    window.requestAnimationFrame(() => {
      tick( playable );
    });
  }
};

export default ( playable, options ) => {
  play( playable, options );
  tick( playable );
};
