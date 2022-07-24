// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require("path");
const nodeExternals = require("webpack-node-externals");

const isProduction = process.env.NODE_ENV == "production";

const config = {
  mode: "production",
  entry: "./server/index.ts",
  output: {
    clean: true,
    path: path.resolve(__dirname, "dist/server"),
    filename: "index.js",
    libraryTarget: "commonjs-module",
  },
  target: "node",
  externalsPresets: { node: true },
  module: {
    rules: [
      {
        test: /\.(ts)$/i,
        loader: "esbuild-loader",
        options: {
          loader: "ts",
        },
      },
    ],
  },
  externals: [
    "blognode",
    (ctx, cb) => {
      const { context, request } = ctx;
      if (/node_modules/.test(context) || !context.includes(__dirname)) {
        return cb(null, "commonjs " + request);
      }
      cb();
    },
    nodeExternals(),
  ],
  resolve: {
    extensions: [".ts", ".js"],
  },
};

module.exports = config;
