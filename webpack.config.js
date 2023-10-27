const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = process.env.NODE_ENV || 'development';

module.exports = {
    mode,
    entry: './src/ts/main.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ca]ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader',
                ],
            },
            {
                test: /\.hbs$/,
                use: 'handlebars-loader',
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/templates/index.hbs',
            filename: 'index.html',
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/images/', to: 'images' },
                { from: './src/fonts/', to: 'fonts' },
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'css/style.css',
        }),
    ],
    resolve: {
        extensions: ['.ts', '.js'],
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
    },
};