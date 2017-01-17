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
      loaders: [
      // webpack 2
      /*
      rules: [
      */
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

        // *.json => like in node, return json
        // (not handled by webpack by default)
        {
          test: /\.json$/,
          loader: 'json-loader'
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

      // webpack 2
      /*
      // You should be able to remove the block below when the following
      // issue has been correctly handled (and postcss-loader supports
      // "plugins" option directly in query, see postcss-loader usage above)
      // https://github.com/postcss/postcss-loader/issues/99
      new webpack.LoaderOptionsPlugin({
        test: /\.css$/,
        options: {
          // required to avoid issue css-loader?modules
          // this is normally the default value, but when we use
          // LoaderOptionsPlugin, we must specify it again, otherwise,
          // context is missing (and css modules names can be broken)!
          context: __dirname,
        },
      }),
      */

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

      // webpack 1
      // new ExtractTextPlugin('[name].[hash].css', { disable: config.dev }),
      // webpack 2
      new ExtractTextPlugin({
        filename: '[name].[hash].css',
        disable: config.dev
      }),

      ...config.production && [
        // webpack 2
        // DedupePlugin does not work correctly with Webpack 2, yet ;)
        // https://github.com/webpack/webpack/issues/2644
        new webpack.optimize.DedupePlugin(),
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

    // webpack 1
    resolve: {
      extensions: [ '.js', '.json', '' ],
      root: [ path.join(__dirname, 'node_modules') ]
    },
    resolveLoader: { root: [ path.join(__dirname, 'node_modules') ] }
    // webpack 2
    /*
    resolve: { extensions: [ ".js", ".json" ] },
    */
  }
}
