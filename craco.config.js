const CracoLessPlugin = require("craco-less");
const MonacoEditorWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require('path');
const APP_DIR = path.resolve(__dirname, './src');
const MONACO_DIR = path.resolve(__dirname, './node_modules/monaco-editor');

module.exports = {
  webpack: {
    module: {
      rules: [
        {
          test: /\.css$/,
          include: APP_DIR,
          use: [
            {
              loader: "style-loader",
            },
            {
              loader: "css-loader",
              options: {
                modules: true,
                namedExport: true,
              },
            },
          ],
        },
        {
          test: /\.css$/,
          include: MONACO_DIR,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    plugins: [new MonacoEditorWebpackPlugin()],
  },
  plugins: [
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            // modifyVars: { '@primary-color': '#1DA57A' },
            javascriptEnabled: true,
          },
        },
      },
    },
  ],
};
