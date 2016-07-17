import { finished } from '../helpers';

const currentKeyframeIndex = ( currentProgress, keyframe2Index ) => {
  if ( currentProgress > 0 && currentProgress < 1 ) {
    return keyframe2Index;
  }

  return null;
};

const events = playable => {
  const { state, timeline } = playable;
  const { animation } = state;
  const { keyframes } = timeline;

  const {
    alternate,
    currentProgress,
    currentReverse,
    iterationsComplete,
    keyframe1Index,
    keyframe2Index,
  } = animation;

  const c = currentKeyframeIndex( currentProgress, keyframe2Index );

  const p = previousKeyframeIndex({
    alternate,
    currentProgress,
    currentReverse,
    iterationsComplete,
    keyframe1Index,
    keyframe2Index,
    keyframeLength: keyframes.length,
  });

  if ( p ) {
    if ( p !== c || animation.keyframes[ p ].reverse !== currentReverse ) {
      if ( animation.keyframes[ p ].started && !animation.keyframes[ p ].finished ) {
        animation.keyframes[ p ].started = false;
        animation.keyframes[ p ].finished = true;

        if ( typeof keyframes[ p ].animation.finish === 'function' ) {
          keyframes[ p ].animation.finish();
        }
      }
    }
  }

  if ( c ) {
    if ( !animation.keyframes[ c ].started ) {
      animation.keyframes[ c ].started = true;
      animation.keyframes[ c ].finished = false;
      animation.keyframes[ c ].reverse = currentReverse;

      if ( typeof keyframes[ c ].animation.start === 'function' ) {
        keyframes[ c ].animation.start();
      }
    }

    if ( typeof keyframes[ c ].animation.update === 'function' ) {
      keyframes[ c ].animation.update();
    }
  }

  if ( typeof animation.update === 'function' ) {
    animation.update();
  }

  if ( finished( animation )) {
    animation.finished = true;

    if ( typeof animation.finish === 'function' ) {
      animation.finish();
    }
  }
};

const previousKeyframeIndex = ({
  alternate,
  currentProgress,
  currentReverse,
  iterationsComplete,
  keyframe1Index,
  keyframe2Index,
  keyframeLength,
}) => {
  if ( currentReverse ) {
    if ( currentProgress === 0 ) {
      return keyframe2Index;
    }

    if ( keyframe2Index + 1 === keyframeLength ) {
      if ( iterationsComplete > 1 ) {
        if ( alternate ) {
          return keyframe2Index;
        }

        return 1;
      }

      return null;
    }

    return keyframe2Index + 1;
  }

  if ( currentProgress === 1 ) {
    return keyframe2Index;
  }

  if ( keyframe1Index === 0 ) {
    if ( iterationsComplete > 1 ) {
      if ( alternate ) {
        return 1;
      }

      return keyframeLength - 1;
    }

    return null;
  }

  return keyframe1Index;
};

export default events;
