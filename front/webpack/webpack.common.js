const path = require('path');
const webpack = require('webpack');
const loaders = require('./loaders');
const plugins = require('./plugins');

module.exports = {
  entry: {
    BeerCrackerz: ['./front/src/BeerCrackerz.js'],
    BeerCrackerzAuth: ['./front/src/BeerCrackerzAuth.js']
  },
  module: {
    rules: [loaders.JSLoader, loaders.CSSLoader, loaders.FontLoader],
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, '../../static/dist'),
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
