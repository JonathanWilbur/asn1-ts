const path = require("path");

module.exports = {
    entry: [
        "./source/indices/cer.ts",
    ],
    output: {
        path: path.resolve(__dirname, "..", "dist"),
        filename: "cer.min.js",
        library: "cer",
        libraryTarget: "var",
    },
    mode: "production",
    module: {
        rules: [
            {
                test: /\.tsx?$/u,
                loader: "ts-loader",
                exclude: /node_modules/u,
            },
        ],
    },
    resolve: {
        extensions: [
            ".ts",
            ".js",
        ],
    },
    optimization: {
        minimize: true,
    },
    target: "web",
};
