export default {
  module: {
    loaders: [{
      exclude: /node_modules/,
      loader: 'babel',
      test: /\.js$/,
    }],
  },
};
