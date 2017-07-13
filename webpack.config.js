var fs = require('fs');
var path = require('path');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: './server/app.js',
  target: 'node',
  externals: nodeModules,
  module: {
    loaders: [
      { test: /\.(html|pem|crt|key)$/, loader: "file-loader" }
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  devtool: 'sourcemap'
};
