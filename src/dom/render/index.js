const addNodes = ( target, renderables ) => {
  let container = svg( target );

  renderables.map(({ nodes, selector, state }) => {
    nodes.map(( n, i ) => {
      if ( i === 0 && selector ) {
        const el = container.querySelector( selector );
        el.parentNode.replaceChild( n, el );
      } else {
        container.appendChild( n );
      }

      if ( !state.shapes[ i ].d ) {
        container = n;
      }
    });
  });
};

const createNodes = shape => {
  shape.nodes = shape.state.shapes.map(({ d }) => {
    if ( d ) {
      return document.createElementNS( 'http://www.w3.org/2000/svg', 'path' );
    }

    return document.createElementNS( 'http://www.w3.org/2000/svg', 'g' );
  });
};

const render = ( target, ...renderables ) => {
  renderables.map( renderable => {
    renderNodes( renderable );
  });

  addNodes( target, renderables )
};

const renderNodes = renderable => {
  if ( !renderable.nodes ) {
    createNodes( renderable );
  }

  updateNodes( renderable );
};

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

const updateNodes = ({ nodes, state }) => {
  nodes.map(( n, i ) => {
    const shape = state.shapes[ i ];

    Object.keys( shape ).forEach( key => {
      n.setAttribute( key, shape[ key ]);
    });
  });
};

export { renderNodes };
export default render;
