const path = require('path');
module.exports = {
    entry: [
        "./source/indices/der.ts"
    ],
    output: {
        path: path.resolve(__dirname, "../../dist"),
        filename: "der.js",
        library: "asn1",
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
        minimize: true
    },
    target: "web"
};