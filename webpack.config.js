module.exports = {
  entry: "./static/js/client.js",
  output: {
    filename: "./static/js/client-packed.js"
  },
  module: {
    loaders: [{
      loader:'babel',
      exclude: /node_modules/
    }]
  },
  devtool: 'sourcemap'
}