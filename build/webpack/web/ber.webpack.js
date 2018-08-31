const path = require('path');
module.exports = {
    entry: [
        "./source/indices/ber.ts"
    ],
    output: {
        path: path.resolve(__dirname, "../../dist/web"),
        filename: "ber.min.js",
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