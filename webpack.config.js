const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')
const { SkeletonPlugin } = require('./skeleton')

module.exports = {
  mode: 'development',
  devtool: false,
  entry: './src/index.js',
  output: {
    path: resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        ],
        exclude: /node_modules/
      }
    ]
  },
  devServer: {
    hot: true,
    open: true
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new SkeletonPlugin({
      static: resolve(__dirname, 'dist'),
      port: 3000,
      origin: 'http://localhost:3000',
      device: 'iPhone 6'
    })
  ]
}