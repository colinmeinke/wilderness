const svgAttrs = [
  'height',
  'preserveAspectRatio',
  'viewBox',
  'width',
];

const render = ( target, ...playable ) => {
  const container = document.querySelector( target.selector );

  let svg;

  if ( container.nodeName === 'svg' ) {
    svg = container;
  } else {
    svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );

    Object.keys( target )
      .filter( attr => svgAttrs.indexOf( attr ) !== -1 )
      .forEach( attr => {
        svg.setAttribute( attr, target[ attr ]);
      });

    container.appendChild( svg );
  }

  playable.map(({ selector, state }) => {
    if ( selector ) {
      const el = svg.querySelector( selector );

      if ( el ) {
        return el.parentNode.replaceChild( state.node, el );
      }
    }

    return svg.appendChild( state.node );
  });
}

export default render;
