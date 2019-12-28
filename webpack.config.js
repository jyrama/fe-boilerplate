var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  mode: 'development',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    './src/index'
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
    alias: { mobx: __dirname + "/node_modules/mobx/lib/mobx.es6.js" }
  },
  module: {
    rules: [{
      test: /\.tsx?$/,
      loader: "ts-loader",
      include: path.join(__dirname, 'src')
    }]
  }
};
