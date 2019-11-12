const path = require("path");

module.exports = {
    entry: [
        "./source/indices/ber.ts",
    ],
    output: {
        path: path.resolve(__dirname, "..", "dist"),
        filename: "ber.min.js",
        library: "ber",
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
