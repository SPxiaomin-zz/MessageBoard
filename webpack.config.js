var webpack = require('webpack');

module.exports = {
    entry: './public/javascript/build/component.js',
    output: {
        path: './public/javascript/src',
        filename: 'bundle.js'
    },
    module: {
        loaders: [{
            test: /\.jsx?$/,
            exclude: /node_modules/,
            loader: 'babel',
            query: {
                presets: ['react']
            }
        }]
    }
};
