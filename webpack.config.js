const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const json5 = require('json5');

const compile_stage = require('./src/compile_stage/compile.js')


console.log(`Handlebars context:\n${JSON.stringify(compile_stage.template_context, null, 2)}`)

const mode = process.env.NODE_ENV || 'development';

module.exports = {
    mode,
    entry: {
        main: './src/index.ts',
        worker: './src/webworker/worker.ts'
    },
    output: {
        filename: '[name].bundle.js',
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
                test: /\.worker.ts$/,
                use: {loader: 'worker-loader', options: {inline: true}},
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
            {
                test: /\.json5$/i,
                type: 'json',
                parser: {
                    parse: json5.parse,
                },
            },
            {
                test: /\.(csv|tsv)$/i,
                use: ['csv-loader'],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/templates/index.hbs',
            filename: 'index.html',
            templateParameters: compile_stage.template_context
        }),
        new CopyWebpackPlugin({
            patterns: [
                {from: './src/images/', to: 'images'},
                {from: './src/fonts/', to: 'fonts'},
            ],
        }),
        new MiniCssExtractPlugin({
            filename: 'style/style.css',
        }),
    ],
    resolve: {
        extensions: ['.js', '.ts'],
    },
    devServer: {
        static: path.join(__dirname, 'dist'),
        compress: true,
        port: 8080,
    },
};
