const path = require('path');
module.exports = {
    entry: [
        "./source/indices/der.ts"
    ],
    output: {
        path: path.resolve(__dirname, "../../dist/web"),
        filename: "der.min.js",
        library: "asn1",
        libraryTarget: "var"
    },
    resolve: {
        extensions: [ ".ts" ]
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.ts$/,
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