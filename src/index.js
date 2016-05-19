const warning = func => `The \`${ func }()\` function is currently in development.`;

const shape = () => console.warn( warning( 'shape' ));

const timeline = () => console.warn( warning( 'timeline' ));

const render = () => console.warn( warning( 'render' ));

const play = () => console.warn( warning( 'play' ));

const pause = () => console.warn( warning( 'pause' ));

export { pause, play, render, shape, timeline };
