/**********************************************************************************
 *                                                                                *
 *    Copyright (C) 2021  SYMON Contributors                                      *
 *                                                                                *
 *   This program is free software: you can redistribute it and/or modify         *
 *   it under the terms of the GNU Affero General Public License as published     *
 *   by the Free Software Foundation, either version 3 of the License, or         *
 *   (at your option) any later version.                                          *
 *                                                                                *
 *   This program is distributed in the hope that it will be useful,              *
 *   but WITHOUT ANY WARRANTY; without even the implied warranty of               *
 *   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the                *
 *   GNU Affero General Public License for more details.                          *
 *                                                                                *
 *   You should have received a copy of the GNU Affero General Public License     *
 *   along with this program.  If not, see <https://www.gnu.org/licenses/>.       *
 *                                                                                *
 **********************************************************************************/

/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserJSPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");

const NODE_ENV = process.env.NODE_ENV || "development";
const isEnvDevelopment = NODE_ENV === "development";
const isEnvProduction = NODE_ENV === "production";

const dotenvFiles = [
  `.env.${NODE_ENV}.local`,
  NODE_ENV !== "test" && `.env.local`,
  `.env.${NODE_ENV}`,
  ".env",
].filter(Boolean);

dotenvFiles.forEach(dotenvFile => {
  if (fs.existsSync(dotenvFile)) {
    require("dotenv").config({
      path: dotenvFile,
    });
  }
});

const env = getClientEnvironment();

// Get current commit hash to be appended to index.html
const getCommitHash = () => {
  try {
    let hash = require("child_process")
      .execSync("git rev-parse --short HEAD")
      .toString()
      .trim();
    return hash;
  } catch (e) {
    return env.raw["REACT_APP_GIT_HASH"];
  }
};

module.exports = {
  mode: isEnvProduction ? "production" : isEnvDevelopment && "development",
  devtool: isEnvProduction ? "source-map" : "inline-source-map",
  entry: "./src/client/index.tsx",
  output: {
    filename: "static/js/[name].[contenthash:8].js",
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js",
    publicPath: "/",
  },
  optimization: {
    minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    splitChunks: {
      chunks: "all",
    },
    runtimeChunk: true,
    usedExports: true,
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
    fallback: {
      fs: false,
      path: false,
    },
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" },
      {
        test: /\.css$/i,
        use: [
          isEnvProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
          "postcss-loader",
        ],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/client/index.html",
      templateParameters: {
        __COMMIT_HASH__: getCommitHash(),
      },
    }),
    new MiniCssExtractPlugin({
      filename: "static/css/[name].[contenthash:8].css",
      chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
    }),
    new webpack.DefinePlugin(env.stringified),
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

// https://github.com/facebook/create-react-app/blob/master/packages/react-scripts/config/env.js

function getClientEnvironment() {
  const raw = Object.keys(process.env)
    .filter(key => /^REACT_APP_/i.test(key))
    .reduce(
      (env, key) => {
        env[key] = process.env[key];
        return env;
      },
      {
        NODE_ENV,
        PUBLIC_URL: "/",
      },
    );
  const stringified = {
    "process.env": Object.keys(raw).reduce((env, key) => {
      env[key] = JSON.stringify(raw[key]);
      return env;
    }, {}),
  };

  return { raw, stringified };
}
