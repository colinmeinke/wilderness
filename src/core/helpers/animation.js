import easingFunctions from 'tween-functions';

const currentIteration = totalIterations => (
  Math.max( 1, Math.ceil( totalIterations ))
);

const currentState = animation => {
  const { alternate, initialProgress, reverse } = animation;

  const iterations = iterationsComplete( animation );
  const totalIterations = iterations + initialProgress;
  const i = currentIteration( totalIterations );
  const r = currentReverse( alternate, i, reverse );
  const progress = totalIterations - previousIteration( totalIterations );

  return {
    currentProgress: r ? 1 - progress : progress,
    currentReverse: r,
    iterationsComplete: iterations,
  };
};

const currentReverse = ( alternate, iteration, reverse ) => (
  alternate ? ( iteration % 2 === 0 ? !reverse : reverse ) : reverse
);

const easingFunc = easing => easingFunctions[ easing ];

const iterationsComplete = ({ duration, iterations, play, pause }) => {
  const time = Math.max( 0, pause ? pause - play : Date.now() - play );
  return Math.min( iterations, time / duration );
};

const finished = animation => (
  iterationsComplete( animation ) >= animation.iterations
);

const paused = ({ pause }) => Boolean( pause );

const previousIteration = totalIterations => (
  Math.max( 0,
    totalIterations % 1 === 0 ?
      Math.floor( totalIterations - 0.1 ) :
      Math.floor( totalIterations )
  )
);

export {
  currentIteration,
  currentState,
  currentReverse,
  easingFunc,
  finished,
  iterationsComplete,
  paused,
  previousIteration,
};
