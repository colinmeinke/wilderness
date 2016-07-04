const svgAttrs = [
  'height',
  'preserveAspectRatio',
  'viewBox',
  'width',
];

const svg = target => {
  const { selector, ...el } = target;

  if ( !selector ) {
    return el;
  }

  const outer = document.querySelector( selector );

  if ( outer.nodeName === 'svg' ) {
    return outer;
  }

  const inner = outer.querySelector( 'svg' );

  if ( inner.nodeName === 'svg' ) {
    return inner;
  }

  const s = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );

  Object.keys( target )
    .filter( attr => svgAttrs.indexOf( attr ) !== -1 )
    .forEach( attr => {
      s.setAttribute( attr, target[ attr ]);
    });

  outer.appendChild( s );

  return s;
};

const render = ( target, ...playable ) => {
  const container = svg( target );

  playable.map(({ selector, state }) => {
    if ( selector ) {
      const el = container.querySelector( selector );

      if ( el ) {
        return el.parentNode.replaceChild( state.node, el );
      }
    }

    return container.appendChild( state.node );
  });
};

export default render;
