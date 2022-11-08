const webpack = require('webpack');
const loaders = require('../webpack/loaders');
const plugins = require('../webpack/plugins');

module.exports = config => {
  config.set({
    basePath: '../',
    singleRun: !config.dev, // Keep browser open in dev mode
    browsers: ['Firefox'],
    frameworks: ['jasmine'],
    client: {
      jasmine: {
        clearContext: false,
        random: !config.dev // Randomly run test when not developping them
      }
    },
    files: [
      'https://unpkg.com/leaflet@1.7.1/dist/leaflet.css',
      'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.Default.css',
      'https://unpkg.com/leaflet.markercluster@1.4.1/dist/MarkerCluster.css',
      'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js',
      'https://unpkg.com/leaflet.markercluster@1.4.1/dist/leaflet.markercluster.js',
      'test/testContext.js',
      'test/testStyle.css',
      'test/templates/index.html',
      '../static/dist/*.css'
    ],
    reporters: ['kjhtml', 'progress'],
    preprocessors: {
      'test/testContext.js': ['webpack'],
      '**/*.html': ['html2js']
    },
    babelPreprocessor: {
      options: {
        presets: ['env'],
        sourceMap: false
      }
    },
    webpack: {
      devtool: false,
      module: {
        rules: [
          loaders.JSLoader,
          loaders.CSSLoader
        ]
      },
      plugins: [
        new webpack.ProgressPlugin(),
        plugins.CleanWebpackPlugin,
        plugins.ESLintPlugin,
        plugins.StyleLintPlugin,
        plugins.MiniCssExtractPlugin
      ],
      watch: true,
      mode: 'development'
    },
    webpackServer: {
      noInfo: true
    }
  });
};
