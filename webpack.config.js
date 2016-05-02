module.exports = {
    entry: './public/app.js',
    output: {
        filename: './public/app-compiled.js'
    },
    module: {
        loaders:[{
            loader:'babel',
            exclude: /node_modules/
        }]
    },
    devtool: 'sourcemap'
};