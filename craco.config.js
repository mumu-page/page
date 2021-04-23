const webpack = require('webpack')
const CracoLessPlugin = require("craco-less");
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

module.exports = {
  webpack: {
    module: {
      rules: [
      ],
    },
    plugins: [
        new HtmlWebpackExternalsPlugin({
            externals: [
                {
                    module: 'Babel',
                    entry: 'https://cdn.bootcdn.net/ajax/libs/babel-standalone/6.7.7/babel.min.js',
                    global: 'Babel'
                }
            ]
        }),
        new webpack.BannerPlugin('可视化编辑器')
    ],
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
