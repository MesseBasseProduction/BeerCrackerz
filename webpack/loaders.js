const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const CSSLoader = {
  test: /\.scss$/i,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        publicPath: path.resolve(__dirname, '../assets/dist/')
      }
    },
    {
      loader: 'css-loader',
      options: { importLoaders: 1 },
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          config: path.resolve(__dirname, 'postcss.config.js'),
        },
      },
    },
    'sass-loader'
  ]
};

const JSLoader = {
  test: /\.js$/i,
  exclude: /node_modules/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['@babel/preset-env']
    }
  }
};

const FontLoader = {
  test: /\.(woff|ttf)$/,
  exclude: /node_modules/,
  use: {
    loader: 'url-loader',
  }
};

module.exports = {
  CSSLoader: CSSLoader,
  JSLoader: JSLoader,
  FontLoader: FontLoader
};
