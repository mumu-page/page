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
              'https://cdn.bootcdn.net/ajax/libs/react/17.0.2/umd/react.production.min.js',
            global: 'React',
          },
          {
            module: 'react-dom',
            entry:
              'https://cdn.bootcdn.net/ajax/libs/react-dom/17.0.2/umd/react-dom.production.min.js',
            global: 'ReactDOM',
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
