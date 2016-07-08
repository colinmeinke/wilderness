import { currentState } from '../helpers';

const optionDefaults = {
  alternate: false,
  delay: 0,
  easing: 'easeInOutQuad',
  rate: 1,
};

const play = ( playable, options = {}) => {
  const { timeline, state } = playable;
  const { duration: durationDefault, keyframes } = timeline;

  const now = Date.now();

  const {
    alternate,
    delay,
    duration = durationDefault,
    easing,
    finish,
    rate,
    start,
    update,
  } = {
    ...optionDefaults,
    ...options,
  };

  let { currentProgress, currentReverse, iterationsComplete } = currentState( playable );

  let reverse = currentReverse;
  let reverseChanged = false;

  if ( typeof options.reverse !== 'undefined' ) {
    currentReverse = options.reverse;
    reverse = options.reverse;

    if ( state.animation.started ) {
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

  if ( state.animation.started ) {
    iterations = state.animation.iterations - iterationsComplete;
  }

  if ( typeof options.iterations !== 'undefined' ) {
    iterations = options.iterations;
  }

  state.animation = {
    alternate,
    currentProgress,
    currentReverse,
    duration: duration / rate,
    easing,
    finish,
    finished: false,
    initialProgress,
    iterations,
    iterationsComplete,
    keyframes: keyframes.map(() => ({
      finished: false,
      reverse: currentReverse,
      started: false,
    })),
    play: now + delay,
    reverse,
    start,
    started: true,
    update,
  };

  if ( typeof start === 'function' ) {
    start();
  }
};

export default play;
