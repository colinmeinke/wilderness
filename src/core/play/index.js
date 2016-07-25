import { currentState } from '../helpers';
import { events, state } from '../shape';

const init = ( playable, options ) => {
  const { timeline, state = {}} = playable;
  const { animation = {}} = state;
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
    ...animation,
    ...options,
  };

  let { currentProgress, currentReverse, iterationsComplete } = currentState( animation );
  let reverse = currentReverse;
  let reverseChanged = false;

  if ( typeof options.reverse !== 'undefined' ) {
    currentReverse = options.reverse;
    reverse = options.reverse;

    if ( animation.started ) {
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

  if ( animation.started ) {
    iterations = animation.iterations - iterationsComplete;
  }

  if ( typeof options.iterations !== 'undefined' ) {
    iterations = options.iterations;
  }

  if ( typeof start === 'function' ) {
    start();
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
};

const optionDefaults = {
  alternate: false,
  delay: 0,
  easing: 'easeInOutQuad',
  rate: 1,
};

const play = ( playable, options = {}, t = tick ) => {
  init( playable, options );
  t( playable );
};

const tick = playable => {
  state( playable );
  events( playable );
};

export { tick };
export default play;
