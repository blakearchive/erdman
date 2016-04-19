module.exports = {
    entry: './src/main.tsx',
    output: {
        filename: './dist/bundle.js'
    },
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['', '.webpack.js', '.web.js', '.ts', '.tsx', '.js']
    },
    module: {
        loaders: [
            {test: /\.tsx?$/, loader: 'awesome-typescript-loader'},
            {test: /\.css$/, loader: "style!css" }
        ]
    }
};