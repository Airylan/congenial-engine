module.exports = {
    devtool: 'source-map',
    entry: {
        "app": "./src/app.jsx",
    },
    mode: "development",
    output: {
        filename: "./[name]-bundle.js"
    },
    resolve: {
        extensions: ['.Webpack.js', '.web.js', '.ts', '.js', '.jsx', '.tsx'],
        fallback: {
            "crypto": require.resolve("crypto-js"),
            "stream": require.resolve("stream-browserify")
        }
    },
    module: {
        rules: [
            {
                test: /\.tsx$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'ts-loader'
                }
            },
            {
                test: /\.mjs/,
                resolve: {
                    fullySpecified: false
                }
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /(node_modules|bower_components)/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] }
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"]
            },
            {
                test: /node_modules\/vfile\/core\.js/,
                use: [{
                    loader: 'imports-loader',
                    options: {
                        type: 'commonjs',
                        imports: ['single process/browser process'],
                    },
                }]
            }
        ]
    }
}