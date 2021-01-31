const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

module.exports = {
    plugins: [
		isDevelopment && new ReactRefreshWebpackPlugin()
	]
}