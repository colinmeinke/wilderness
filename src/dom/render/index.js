const svgAttrs = [
  'height',
  'preserveAspectRatio',
  'viewBox',
  'width',
];

const render = ( target, ...playable ) => {
  const { selector, ...attrs } = target;

  const container = document.querySelectorAll( selector )[ 0 ];

  let svg;

  if ( container.nodeName === 'svg' ) {
    svg = container;
  } else {
    svg = document.createElementNS( 'http://www.w3.org/2000/svg', 'svg' );

    Object.keys( attrs )
      .filter( attr => svgAttrs.indexOf( attr ) !== -1 )
      .forEach( attr => {
        svg.setAttribute( attr, attrs[ attr ]);
      })

    container.appendChild( svg );
  }

  playable.forEach(({ node }) => svg.appendChild( node ));
}

export default render;
