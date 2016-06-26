ngminPlugin = require('ngmin-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: './dist/bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css" }
        ]
    },
    plugins: [
        new ngminPlugin()
    ]
};