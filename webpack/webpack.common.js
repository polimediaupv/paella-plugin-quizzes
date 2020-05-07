const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        "paella-plugin-quizzes": "./src/index.js"
    },
    output: {
        path: __dirname + '/../dist',
        publicPath: '/',
        filename: `paella-plugin-quizzes/javascript/[name].js`,
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'localization/**.json',
              to: 'paella-plugin-quizzes/[folder]/paella-plugin-quizzes-[name].[ext]',
              toType: 'template'
            },
        ], { context: '.'} ),
    ],
    externals: {
        jquery: 'jQuery'
    },
    resolve: {
        extensions: ['*', '.js', '.jsx']
    }    
};