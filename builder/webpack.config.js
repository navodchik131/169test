'use strict';

const webpack = require('webpack');
const path = require('path');

const aliasConfig = require(
    path.resolve('./webpack.alias.js')
);

module.exports = {
    devtool: "eval",
    entry: aliasConfig.bundles,
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ["env"]
                    }
                }
            },
            {
                test: /\.scss$/,
                use: [
                    { loader: "style-loader" },
                    { loader: "css-loader" },
                    { loader: "sass-loader" }
                ]
            }
        ]
    },
    resolve: {
		alias:      aliasConfig.modules,
		modules:    ['node_modules', '../libs/vendor/common/library/scripts', '../sources/js/modules'],
        extensions: ['*', '.js', '.jsx']
    },
	resolveLoader: {
		modules:    ['node_modules'],
		extensions: ['.js','.jsx'],
	},
    output: {
        filename: '[name].js'
    },
	plugins: [
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            'window.jQuery': 'jquery'
        }),
	]
};
