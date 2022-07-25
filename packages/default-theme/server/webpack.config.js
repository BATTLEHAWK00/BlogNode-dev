/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const { ESBuildMinifyPlugin } = require('esbuild-loader');

const config = {
  entry: {
    main: './index.tsx',
  },
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015', // Syntax to compile to (see options below for possible values)
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: 'esbuild-loader',
        options: {
          loader: 'tsx',
        },
        exclude: ['/node_modules/'],
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '@util': path.resolve(__dirname, 'util/'),
      '@': path.resolve(__dirname),
    },
  },
};

module.exports = config;
