const webpack = require('webpack')
const CracoLessPlugin = require('craco-less')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')

// const isProruction = process.env.NODE_ENV === 'production'
module.exports = {
  webpack: {
    module: {
      rules: [],
    },
    plugins: [
      new HtmlWebpackExternalsPlugin({
        externals: [
          {
            module: 'react',
            entry:
              'https://cdn.jsdelivr.net/npm/react@17.0.2/umd/react.production.min.js',
            global: 'React',
          },
          {
            module: 'react-dom',
            entry:
              'https://cdn.jsdelivr.net/npm/react-dom@17.0.2/umd/react-dom.production.min.js',
            global: 'ReactDOM',
          },
          {
            module: 'immer',
            entry:
              'https://cdn.jsdelivr.net/npm/immer@9.0.1/dist/immer.umd.production.min.js',
            global: 'immer',
          },
          {
            module: 'react-draggable',
            entry:
              'https://cdn.jsdelivr.net/npm/react-draggable@4.4.3/build/web/react-draggable.min.js',
            global: 'ReactDraggable',
          },
        ],
      }),
      new webpack.BannerPlugin('可视化编辑器'),
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
}
