const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: "./src/client/index.tsx",
  output: {
    filename: "./static/js/bundle.js",
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [{ test: /\.tsx?$/, loader: "ts-loader" }],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/client/index.html",
    }),
  ],
  devServer: {
    port: 4000,
    contentBase: "src/",
    historyApiFallback: true,
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        pathRewrite: {
          "^/api": "",
        },
      },
    },
  },
};
