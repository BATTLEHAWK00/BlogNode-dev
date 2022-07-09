// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
  entry: "./main.tsx",
  output: {
    path: path.resolve(__dirname, "dist/static"),
  },
  plugins: [
    new MiniCssExtractPlugin(),
    // Add your plugins here
    // Learn more about plugins from https://webpack.js.org/configuration/plugins/
  ],
  alias: {},
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        use: ["esbuild-loader"],
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
