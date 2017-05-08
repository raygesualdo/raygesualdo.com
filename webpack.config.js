import path from 'path'

import webpack from 'webpack'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import { phenomicLoader } from 'phenomic'
import PhenomicLoaderFeedWebpackPlugin
  from 'phenomic/lib/loader-feed-webpack-plugin'
import PhenomicLoaderSitemapWebpackPlugin
  from 'phenomic/lib/loader-sitemap-webpack-plugin'

import pkg from './package.json'

export default (config = {}) => {
  return {
    ...config.dev && {
      devtool: '#cheap-module-eval-source-map'
    },
    module: {
      noParse: /\.min\.js/,
      // webpack 1
      rules: [
        // *.md => consumed via phenomic special webpack loader
        // allow to generate collection and rss feed.
        {
          // phenomic requirement
          test: /\.(md|markdown)$/,
          loader: phenomicLoader,
          query: {
            context: path.join(__dirname, config.source)
            // plugins: [
            //   ...require("phenomic/lib/loader-preset-markdown").default
            // ]
            // see https://phenomic.io/docs/usage/plugins/
          }
        },

        // *.js => babel + eslint
        {
          test: /\.js$/,
          include: [
            path.resolve(__dirname, 'scripts'),
            path.resolve(__dirname, 'src')
          ],
          loaders: [
            'babel-loader?cacheDirectory'
            // "eslint-loader" + (config.dev ? "?emitWarning" : ""),
          ]
        },

        // copy assets and return generated path in js
        {
          test: /\.(html|ico|jpe?g|png|gif|eot|otf|webp|ttf|woff|woff2)$/,
          loader: 'file-loader',
          query: {
            name: '[path][name].[hash].[ext]',
            context: path.join(__dirname, config.source)
          }
        },

        // svg as raw string to be inlined
        {
          test: /\.svg$/,
          loader: 'raw-loader'
        }
      ]
    },

    plugins: [
      new webpack.DefinePlugin({
        __ENV__: JSON.stringify(process.env)
      }),

      new PhenomicLoaderFeedWebpackPlugin({
        // here you define generic metadata for your feed
        feedsOptions: {
          title: pkg.title,
          site_url: pkg.homepage
        },
        feeds: {
          // here we define one feed, but you can generate multiple, based
          // on different filters
          'feed.xml': {
            collectionOptions: {
              filter: { layout: 'Post' },
              sort: 'date',
              reverse: true,
              limit: 20
            }
          }
        }
      }),

      new PhenomicLoaderSitemapWebpackPlugin({
        site_url: pkg.homepage
      }),

      new ExtractTextPlugin({
        filename: '[name].[hash].css',
        disable: config.dev
      }),

      ...config.production && [
        new webpack.optimize.UglifyJsPlugin(
          { compress: { warnings: false } }
        )
      ]
    ],

    output: {
      path: path.join(__dirname, config.destination),
      publicPath: config.baseUrl.pathname,
      filename: '[name].[hash].js'
    },

    resolve: { extensions: [ '.js', '.json' ] }
  }
}
