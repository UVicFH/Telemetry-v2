'use strict'

var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
	entry: [
		'babel-polyfill',
		'webpack-hot-middleware/client?reload=true',
		'bootstrap-loader',
		`${__dirname}/client/main.jsx`
	],
	output: {
		path: `${__dirname}dist/`,
		filename: 'client/bundle.js',
		publicPath: '/',
		options: {stats: {
			colors: true,
			timings: true,
			chunks: false,
			modules: false,
			chunkModules: false
		}}
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'client/index.tpl.html',
			inject: 'body',
			filename: 'index.html'
		}),
		new webpack.optimize.OccurenceOrderPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NoErrorsPlugin(),
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development')
		})
	],
	module: {
		preLoaders: [
			{
				test: /\.jsx?$/,
				loader: 'eslint',
				exclude: /node_modules/
			}
		],
		loaders: [
			{
				test: /\.jsx?$/,
				loader: 'babel',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				loaders: ['style', 'css']
			},
			{
				test: /\.(sass|scss)$/,
				loaders: ['style', 'css', 'sass']
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loaders: ['url?limit=10000&minetype=application/font-woff']
			},
			{
				test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				loaders: ['file']
			},
			{
				test: /\.json$/,
				loader: 'json'
			}
		]
	},
	resolve: {
		modulesDirectories: [
			__dirname,
			'client',
			'node_modules',
			'client/components'
		],
		extensions: ['', '.js', '.jsx']
	}
}
