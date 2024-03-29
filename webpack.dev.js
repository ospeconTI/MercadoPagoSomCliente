/** @format */

const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const path = require("path");
const webpack = require("webpack");

module.exports = merge(common, {
    mode: "development",
    devtool: "inline-source-map",
    devServer: {
        static: path.join(__dirname, "dist"),
    },
    output: {
        filename: "[name].bundle.js",
        path: path.resolve(__dirname, "dist"),
        libraryTarget: "var",
        library: "EntryPoint",
        publicPath: "/",
    },
    plugins: [
        new webpack.DefinePlugin({
            SERVICE_URL: JSON.stringify("http://localhost/promocionsocial"),
            OM_SERVICE_URL: JSON.stringify("http://localhost:5028"),
            WS_SERVICE_URL: JSON.stringify("wss://wstest.uocra.net"),
            /*   SERVICE_URL: JSON.stringify("https://www.uocra.net/intranet/promocionsocial/MotivosCategorias"),
            OM_SERVICE_URL: JSON.stringify("https://MPSOM.uocra.net"),
            WS_SERVICE_URL: JSON.stringify("wss://ws.uocra.net"), */
        }),
    ],
});
