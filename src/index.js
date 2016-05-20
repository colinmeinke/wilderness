import { render, shape } from './dom';

const warning = func => `The \`${ func }()\` function is currently in development.`;

const timeline = () => console.warn( warning( 'timeline' ));

const play = () => console.warn( warning( 'play' ));

const pause = () => console.warn( warning( 'pause' ));

export { pause, play, render, shape, timeline };
