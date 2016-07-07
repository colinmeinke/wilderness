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
  let container = svg( target );

  playable.map(({ selector, state }) => {
    const { nodes, shapes } = state;

    nodes.map(( n, i ) => {
      if ( i === 0 && selector ) {
        const el = container.querySelector( selector );
        el.parentNode.replaceChild( n, el );
      } else {
        container.appendChild( n );
      }

      if ( !shapes[ i ].d ) {
        container = n;
      }
    });
  });
};

export default render;
