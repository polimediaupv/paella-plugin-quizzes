const merge = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    output: {
        filename: `paella-plugin-quizzes/javascript/[name]-es2015.js`
    },
    module: {
        rules: [           
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            ['@babel/preset-react', {"pragma": "Preact.h"}]
                        ]
                    }
                }
            }
        ]
    }
});
