// Generated using webpack-cli https://github.com/webpack/webpack-cli
const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader")
const fs = require("fs");
const { alias } = require("./webpack-base")

const isProduction = process.env.NODE_ENV == "production";
const stylesHandler = MiniCssExtractPlugin.loader;

const config = {
    entry: {
        main: "./main.tsx",
    },
    output: {
        path: path.resolve(__dirname, "dist/static"),
        clean: true,
        filename: "[name].js",
        chunkFilename: "[name].js",
        publicPath: "/static/",
    },
    devServer: {
        port: 8081,
        hot: true,
        compress: true,
        proxy: {
            "/": {
                target: "http://localhost:8080",
            },
        },
    },
    optimization: {
        minimizer: [
            new ESBuildMinifyPlugin({
                target: 'es2015',  // Syntax to compile to (see options below for possible values)
                css: true
            })
        ],
        splitChunks: {
            automaticNameDelimiter: "-",
            cacheGroups: {
                vendors: {
                    name: "vendor",
                    chunks: 'async',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -20,
                    minSize: 0
                },
                components: {
                    name: "components",
                    chunks: 'all',
                    test: /[\\/]components[\\/]/,
                    priority: -20,
                    minSize: 0,
                },
            }
        }
    },
    plugins: [
        new MiniCssExtractPlugin(),
        // Add your plugins here
        // Learn more about plugins from https://webpack.js.org/configuration/plugins/
    ],
    devtool: "eval",
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
                use: [
                    stylesHandler,
                    "css-loader",
                    "postcss-loader",
                ],
                exclude: ["/node_modules/", /\.module\.css$/],
            },
            {
                test: /\.module\.css$/i,
                use: [
                    stylesHandler,
                    {
                        loader: "css-loader",
                        options: {
                            import: true,
                            modules: true,
                        },
                    },
                    "postcss-loader",
                ],
                exclude: ["/node_modules/"],
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
        alias,
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
