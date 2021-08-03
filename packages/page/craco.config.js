const { BannerPlugin } = require('webpack')
const CracoLessPlugin = require('craco-less')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const BundleAnalyzerPlugin =
  require('webpack-bundle-analyzer').BundleAnalyzerPlugin

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
            module: 'antd',
            entry: 'https://cdn.jsdelivr.net/npm/antd@4/dist/antd.min.js',
            global: 'antd',
          },
          {
            module: 'moment',
            entry: 'https://cdn.jsdelivr.net/npm/moment@2/moment.min.js',
            global: 'moment',
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
          {
            module: 'lodash',
            entry: 'https://cdn.jsdelivr.net/npm/lodash@4/lodash.min.js',
            global: '_',
          },
          // monaco-editor
          {
            module: 'prop-types',
            entry: 'https://unpkg.com/prop-types@15.7.2/prop-types.js',
            global: 'PropTypes',
          },
          {
            module: 'state-local',
            entry:
              'https://unpkg.com/state-local@1.0.7/lib/umd/state-local.min.js',
            global: 'state',
          },
          {
            module: '@monaco-editor/loader',
            entry:
              'https://cdn.jsdelivr.net/npm/@monaco-editor/loader@1/lib/umd/monaco-loader.min.js',
            global: 'monaco_loader',
          },
          {
            module: '@monaco-editor/react',
            entry:
              'https://cdn.jsdelivr.net/npm/@monaco-editor/react@4/lib/umd/monaco-react.min.js',
            global: 'monaco_react',
          },
          // end
          // {
          //   module: '@r-generator/core',
          //   entry:
          //     'https://cdn.jsdelivr.net/npm/@r-generator/core@0.1.3/dist/index.min.js',
          //   global: 'RGenerateCore',
          // },
          // {
          //   module: '@r-generator/mapping',
          //   entry:
          //     'https://cdn.jsdelivr.net/npm/@r-generator/mapping@0.1.3/dist/index.min.js',
          //   global: 'RGenerateMapping',
          // },
        ],
      }),
      new BannerPlugin('by all resonance'),
      new BundleAnalyzerPlugin(),
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
