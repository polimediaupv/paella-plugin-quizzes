const merge = require('webpack-merge');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MergeJsonWebpackPlugin = require("merge-jsons-webpack-plugin");

const es6 = require('./webpack/webpack.es6.js');


module.exports = merge(es6, {    
    mode: 'development',
    devtool: 'source-map',
    output: {        
        publicPath: '/'        
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'player/javascript/**', to: '.' },
            { from: 'player/localization/**', to: '.' },
            { from: 'player/resources/**', to: '.' },
        ], { context: './node_modules/paellaplayer/build/'} ),
        new CopyWebpackPlugin([
            { from: 'repository/**', to: '.' },
        ], { context: './node_modules/paellaplayer/build/'} ),
        new CopyWebpackPlugin([
            { from: 'repository/**', to: '.' },
        ], { context: '.'} ),
        new CopyWebpackPlugin([
            { from: 'localization/**.json',
              to: 'player/[folder]/paella-plugin-quizzes-[name].[ext]',
              toType: 'template'
            },
        ], { context: '.'} ),                

        new HtmlWebpackPlugin({
            filename: 'player/index.html',
            template: './node_modules/paellaplayer/build/player/index.html'
        }),
        new MergeJsonWebpackPlugin({
            "debug": true,
            "files": [
                "./node_modules/paellaplayer/build/player/config/config.json",
                "./config/config.json"
            ],
            "output": {
                'fileName': 'player/config/config.json'
            },
            "globOptions": {
                "nosort": true
            }
        })
    ],
    devServer: {
        contentBase: __dirname + '/dist'
    },
});