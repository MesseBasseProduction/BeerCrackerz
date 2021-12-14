'use strict';

const path = require('path');
const webpack = require('webpack');
const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
  entry: ['./src/BeerCrackerz.js'],
  module: {
    rules: [loaders.JSLoader, loaders.CSSLoader, loaders.FontLoader],
  },
  output: {
    filename: 'BeerCrackerz.bundle.js',
    path: path.resolve(__dirname, '../assets/dist'),
    library: 'BeerCrackerz', // We set a library name to bundle the export default of the class
    libraryTarget: 'window', // Make it globally available
    libraryExport: 'default', // Make BeerCrackerz.default become BeerCrackerz
  },
  plugins: [
    new webpack.ProgressPlugin(),
    plugins.CleanWebpackPlugin,
    plugins.ESLintPlugin,
    plugins.StyleLintPlugin,
    plugins.MiniCssExtractPlugin,
  ],
};
