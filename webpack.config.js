const fastGlob = require('fast-glob')
const path = require('path')
const webpack = require('webpack')

const ManifestPlugin = require('webpack-manifest-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')

const RemoveEmptyScriptsPlugin = require('webpack-remove-empty-scripts')
const TerserPlugin = require('terser-webpack-plugin')

var CompressionPlugin = require('compression-webpack-plugin')

const isDev = process.env.NODE_ENV !== 'production'
const filename = '[name]'

const entries = {}

fastGlob.sync(path.resolve(__dirname, 'src/react-apps/*-app.js')).forEach(el => {
  const name = el.split('/').pop().split('-app.js')[0]
  entries[name] = el
})

module.exports = {
  mode: isDev ? 'development' : 'production',
  stats: {
    colors: true,
    preset: 'minimal',
  },
  performance: { hints: isDev ? false : 'warning' },
  devtool: isDev ? 'cheap-module-source-map' : 'source-map',
  entry: entries,
  output: {
    path: path.resolve(__dirname, '_build/_assets'),
    publicPath: '/_assets/',
    filename: `${filename}.js`,
  },
  plugins: [
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 10240,
      minRatio: 0.8,
    }),
    new webpack.ids.HashedModuleIdsPlugin(),
    new ManifestPlugin(),
    new RemoveEmptyScriptsPlugin(),
    new MiniCssExtractPlugin({
      filename: `${filename}.css`,
    }),
  ],
  ...(!isDev && {
    optimization: {
      concatenateModules: true,
//      concatenateModules: false,


      
      nodeEnv: 'production', // reduces a lot bundle size by making sude webpack understands we are in production mode - https://webpack.js.org/configuration/optimization/
      mangleWasmImports: true, // doesn't seem to reduce buldle size
      removeAvailableModules: true, // doesn't seem to reduce buldle size
      minimizer: [
        new TerserPlugin(),
        new CssMinimizerPlugin({
          minimizerOptions: {
            preset: [
              'default',
              {
                discardComments: { removeAll: true },
                discardUnused: { removeAll: true },
              },
            ],
          },
        }),
      ],
    },
  }),
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{ loader: 'babel-loader' }],
      },
      {
        test: /\.css$/i,
        exclude: /node_modules/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              sourceMap: isDev,
            },
          },
        ],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        type: 'asset/resource',
      },
    ],
  },
  resolve: {
    alias: {
      // Helpful alias for importing assets
      assets: path.resolve(__dirname, 'src/_assets'),
    },
  },
}
