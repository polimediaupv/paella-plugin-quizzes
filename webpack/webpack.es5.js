const merge = require('webpack-merge');
const common = require('./webpack.common.js');


module.exports = merge(common, {
    module: {
        rules: [           
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env', 
                            ['@babel/preset-react', {"pragma": "Preact.h"}]
                        ]
                    }
                }
            }
        ]
    }
});
