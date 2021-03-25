const CracoLessPlugin = require('craco-less')
const MonacoEditorWebpackPlugin = require('monaco-editor-webpack-plugin')

module.exports = {
  webpack: {
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
}
