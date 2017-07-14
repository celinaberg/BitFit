var fs = require('fs');
var path = require('path');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

var serverConfig = {
  entry: './server/app.js',
  target: 'node',
  externals: nodeModules,
  module: {
    loaders: [
      {
        test: /\.(html|pem|crt|key)$/,
        loader: "file-loader"
      }
    ]
  },
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'backend.js'
  },
  devtool: 'sourcemap'
};

var clientConfig = {
  entry: './client/app/app.js',
  target: 'web',
  plugins: [
    new ExtractTextPlugin('styles.css')
  ],
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(["css-loader"])
      },
      {
        test: /\.(html)$/,
        use: {
          loader: 'html-loader',
          options: {
            attrs: [':data-src']
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, 'build/client'),
    filename: 'app.js'
  },
  devtool: 'sourcemap'
};

module.exports = [ serverConfig, clientConfig ];
