const path = require("path");

module.exports = {
    entry: [
        "./source/indices/der.ts",
    ],
    output: {
        path: path.resolve(__dirname, "..", "dist"),
        filename: "der.min.js",
        library: "der",
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
