/* eslint-disable object-property-newline */

const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const WebpackNotifier = require('webpack-notifier')
const {DefinePlugin} = require('webpack')

module.exports = options => ({
  entry: './demo',
  output: {
    publicPath: '/',
    pathinfo: true,
    filename: '[name]-[hash:5].js'
  },
  resolve: {
    alias: {app: path.resolve(__dirname, 'src')}
  },
  module: {
    rules: [{
      test: /\.js$/,
      include: [
        path.resolve(__dirname, 'demo'),
        path.resolve(__dirname, 'util'),
        path.resolve(__dirname, 'index.js')
      ],
      use: [{loader: 'babel-loader'}]
    }]
  },
  plugins: [
    new WebpackNotifier(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'demo/index.html')
    }),
    new DefinePlugin({
      // NODE_ENV: JSON.stringify('production')
    })
  ]
})
