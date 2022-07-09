// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const fs = require("fs");

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = MiniCssExtractPlugin.loader;

const pageDir = "pages/";

const pages = fs
  .readdirSync(path.resolve(__dirname, pageDir), {
    withFileTypes: true,
  })
  .map((d) => (d.isFile() ? d.name : null))
  .filter((n) => n != null);

const entryMap = pages.reduce((map, cur) => {
  map[pageDir + cur.replace(/(.tsx)$/, "")] = "./" + pageDir + cur;
  return map;
}, {});

const config = {
  entry: {
    "static/main": "./main.tsx",
    ...entryMap,
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    libraryTarget: "commonjs-module",
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "esbuild-loader",
        options: {
          loader: "tsx",
        },
        exclude: ["/node_modules/"],
      },
      {
        test: /\.less$/i,
        use: [stylesHandler, "css-loader", "postcss-loader", "less-loader"],
      },
      {
        test: /\.css$/i,
        use: [stylesHandler, "css-loader", "postcss-loader"],
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },

      // Add your rules for custom modules here
      // Learn more about loaders from https://webpack.js.org/loaders/
    ],
  },
  // externals: ["react"],
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
