module.exports = {
  entry: {
    entry: ['./jquery/logvote.js', './jquery/popbox.js', './jquery/createcontentjq.js', './jquery/reply.js', './jquery/logcommentvote.js']
  },
  output: {
    path: "public/compiled-scripts",
    filename: "compiled.js"
  },
  module: {
    loaders: [{
      loader: 'babel',
      exclude: /node_modules/}]
    },
    devtool: 'sourcemap'
  }
