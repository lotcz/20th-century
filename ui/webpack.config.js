const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: {
		index: './index.js',

	},
	devtool: 'inline-source-map',
	devServer: {
		static: {
			directory: path.join(__dirname, 'assets'),
		},
		headers: {"Access-Control-Allow-Origin": "*"},
		allowedHosts: 'all',
		port: 8000
	},
	plugins: [

		new CopyWebpackPlugin({
			patterns: [
				{from: './index.html', to: ''},
				{ from: 'assets/**', to: '' }
			]
		})

	],
	output: {
		filename: '[name].bundle.js',
		path: path.resolve(__dirname, 'build'),
		clean: true,
	},
	module: {}
};
