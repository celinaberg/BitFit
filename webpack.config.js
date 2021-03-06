var fs = require("fs");
var path = require("path");
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var nodeModules = {};
fs.readdirSync("node_modules")
  .filter(function(x) {
    return [".bin"].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = "commonjs " + mod;
  });

var clientConfig = {
  entry: "./client/app/app.js",
  target: "web",
  plugins: [new ExtractTextPlugin("styles.css")],
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loaders: ["babel-loader"]
      },
      {
        test: /\.css$/,
        loader: ExtractTextPlugin.extract(["css-loader"])
      },
      {
        test: /\.html$/,
        use: {
          loader: "html-loader",
          options: {
            minimize: true
          }
        }
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "img/[name].[ext]"
          }
        }
      },
      {
        test: /\.(ttf|eot|woff2|woff|svg)$/,
        use: {
          loader: "file-loader",
          options: {
            name: "fonts/[name].[ext]"
          }
        }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build/client"),
    filename: "app.js"
  },
  devtool: "sourcemap",
  node: {
    fs: "empty"
  }
};

module.exports = [clientConfig];
