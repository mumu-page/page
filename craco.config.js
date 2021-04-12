const CracoLessPlugin = require("craco-less");

module.exports = {
  webpack: {
    module: {
      rules: [
      ],
    },
    plugins: [
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
