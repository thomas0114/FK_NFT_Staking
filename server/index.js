const { createServer } = require('http')
const next = require('next')
const path = require('path')
require('dotenv').config()

const routes = require('./routes')

const PORT = 1337
console.log('#######', process.env.NODE_ENV)
const app = next({
  // whether to launch Next.js in dev mode
  dev: process.env.NODE_ENV !== 'production',
  // Hide error messages containing server information
  quiet: process.env.NODE_ENV !== 'production',
  // conf === next.config.js
  conf: {
    webpack: (config) => {
      config.resolve.alias = {
        ...config.resolve.alias,
        '../../theme.config$': path.join(__dirname, '../my-semantic-theme/theme.config'),
      }
      // config.plugins.push(new ExtractTextPlugin({
      //   filename: '[name].[contenthash].css',
      //   allChunks: true,
      // }))
      // config.module.rules.push({
      //   use: ExtractTextPlugin.extract({
      //     use: ['css-loader', 'less-loader'],
      //   }),
      //   test: /\.less$/,
      // })
      // config.module.rules.push(
      //   {
      //     test: /\.(css|less)/,
      //     loader: 'emit-file-loader',
      //     options: {
      //       name: '[name].[ext]',
      //     },
      //   },
      //   {
      //     test: /\.less/,
      //     loader: ['babel-loader', 'raw-loader', 'less-loader'],
      //   },
      //   {
      //     test: /\.jpe?g$|\.gif$|\.ico$|\.png$|\.svg$/,
      //     use: 'file-loader?name=[name].[ext]?[hash]',
      //   },
      //   {
      //     test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //     loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      //   },
      //   {
      //     test: /\.(ttf|eot)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      //     loader: 'file-loader',
      //   },
      //   {
      //     test: /\.otf(\?.*)?$/,
      //     use: 'file-loader?name=/fonts/[name].[ext]&mimetype=application/font-otf',
      //   },
      // )
      // config.devtool = 'inline-source-map'
      for (const r of config.module.rules) {
        if (r.loader === 'babel-loader') {
          r.options.sourceMaps = false
        }
      }
      return config
    },
  },
})

const handler = routes.getRequestHandler(app)

app.prepare().then(() => {
  createServer(handler).listen(PORT, (err) => {
    if (err) throw err
    console.log(`Ready on localhost:${PORT}`)
  })
})
