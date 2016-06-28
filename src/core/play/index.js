import { currentState } from '../helpers';

const optionDefaults = {
  alternate: false,
  delay: 0,
  easing: 'easeInOutQuad',
  rate: 1,
};

const play = ( playable, options = {}) => {
  const { duration: durationDefault, state } = playable;
  const { animation } = state;
  const now = Date.now();

  const {
    alternate,
    delay,
    duration = durationDefault,
    easing,
    rate,
  } = {
    ...optionDefaults,
    ...animation || {},
    ...options,
  };

  const {
    currentProgress = 0,
    currentReverse = false,
    iterationsComplete = 0,
  } = animation ? currentState( animation ) : {};

  let reverse = currentReverse;
  let reverseChanged = false;

  if ( typeof options.reverse !== 'undefined' ) {
    reverse = options.reverse;

    if ( animation ) {
      reverseChanged = options.reverse !== currentReverse;
    }
  }

  let initialProgress =
    ( reverse && !reverseChanged ) ||
    ( !reverse && reverseChanged ) ?
      1 - currentProgress : currentProgress;

  if ( typeof options.initialProgress !== 'undefined' ) {
    initialProgress = options.initialProgress;
  }

  let iterations = reverse ? initialProgress : 1 - initialProgress;

  if ( animation ) {
    iterations = animation.iterations - iterationsComplete;
  }

  if ( typeof options.iterations !== 'undefined' ) {
    iterations = options.iterations;
  }

  state.animation = {
    alternate,
    duration: duration / rate,
    easing,
    initialProgress,
    iterations,
    pause: false,
    play: now + delay,
    reverse,
  };
};

export default play;
