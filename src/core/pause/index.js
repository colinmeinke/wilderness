import { paused } from '../helpers';

const pause = ({ state }) => {
  const { animation } = state;

  if ( animation && !paused( animation )) {
    animation.pause = Date.now();
  }
};

export default pause;
