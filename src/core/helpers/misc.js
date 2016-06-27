const filter = ( props, obj ) => {
  const filtered = {};

  props.forEach( p => {
    const value = obj[ p ];

    if ( typeof value !== 'undefined' ) {
      filtered[ p ] = value;
    }
  });

  return filtered;
};

export { filter };
