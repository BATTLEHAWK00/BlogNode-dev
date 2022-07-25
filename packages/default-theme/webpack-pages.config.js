/* eslint-disable @typescript-eslint/no-var-requires */
// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const fs = require('fs');
const { alias } = require('./webpack-base');

const isProduction = process.env.NODE_ENV == 'production';
const stylesHandler = MiniCssExtractPlugin.loader;

const pageDir = 'pages/';

const pages = fs
  .readdirSync(path.resolve(__dirname, pageDir), {
    withFileTypes: true,
  })
  .map((d) => (d.isFile() ? d.name : null))
  .filter((n) => n != null);

const entryMap = pages.reduce((map, cur) => {
  map[cur.replace(/(.tsx)$/, '')] = `./${pageDir}${cur}`;
  return map;
}, {});

const config = {
  entry: {
    ...entryMap,
  },
  output: {
    path: path.resolve(__dirname, 'dist/pages'),
    clean: true,
    filename: '[name].js',
    libraryTarget: 'commonjs-module',
  },
  plugins: [
    new MiniCssExtractPlugin({
      experimentalUseImportModule: true,
    }),
  ],
  optimization: {
    minimizer: [
      new ESBuildMinifyPlugin({
        target: 'es2015', // Syntax to compile to (see options below for possible values)
      }),
    ],
  },
  target: 'node',
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
      {
        test: /\.css$/i,
        use: [
          {
            loader: stylesHandler,
            options: {
              emit: false,
            },
          },
          {
            loader: 'css-loader',
            options: {
              modules: true,
            },
          },

        ],
        exclude: ['/node_modules/'],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: 'asset',
      },
    ],
  },
  externals: ['react'],
  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.css'],
    alias,
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = 'production';
  } else {
    config.mode = 'development';
  }
  return config;
};
