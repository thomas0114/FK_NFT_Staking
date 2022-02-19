// const webpack = require('webpack')
// const path = require('path')
// const HtmlWebpackPlugin = require('html-webpack-plugin')

// module.exports = {
//   mode: 'development',
//   devtool: 'cheap-module-eval-source-map',
//   entry: [
//     'babel-polyfill',
//     'react-hot-loader/patch',
//     'webpack/hot/only-dev-server',
//     './client/src/app.js',
//   ],
//   output: {
//     path: path.join(__dirname, 'public/dist'),
//     filename: 'bundle.js',
//   },
//   module: {
//     rules: [
//       {
//         test: /\.(js|jsx)$/,
//         exclude: /node_modules/,
//         use: {
//           loader: 'babel-loader',
//         },
//       },
//       {
//         test: /\.css$/,
//         loader: 'style-loader!css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]',
//       },
//     ],
//   },
//   plugins: [
//     // new webpack.optimize.UglifyJsPlugin(),
//     new HtmlWebpackPlugin({
//       template: path.join(__dirname, './client/src/index.html'),
//     }),
//     new webpack.HotModuleReplacementPlugin(),
//   ],
// }
