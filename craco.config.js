const { BannerPlugin } = require('webpack')
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
          {
            module: '@babel/standalone',
            entry:
              'https://cdn.jsdelivr.net/npm/@babel/standalone@7.14.6/babel.min.js',
            global: 'Babel',
          },
          {
            module: '@ant-design/icons',
            entry:
              'https://cdn.jsdelivr.net/npm/@ant-design/icons@4/dist/index.umd.js',
            global: 'icons',
          },
          {
            module: 'sortablejs',
            entry: 'https://cdn.jsdelivr.net/npm/sortablejs@1/Sortable.min.js',
            global: 'Sortable',
          },
        ],
      }),
      new BannerPlugin('by all resonance'),
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
