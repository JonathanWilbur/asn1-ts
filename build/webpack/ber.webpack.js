const path = require('path');
module.exports = {
    entry: [
        "./source/indices/ber.ts"
    ],
    output: {
        path: path.resolve(__dirname, "../../dist"),
        filename: "ber.js",
        library: "ber",
        libraryTarget: "var"
    },
    resolve: {
        extensions: [".webpack.js", ".web.js", ".ts", ".tsx", ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    optimization: {
        minimize: false
    },
    target: "web"
};