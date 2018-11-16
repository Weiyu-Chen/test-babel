const webpack = require('webpack');
const path = require('path');
const WebpackMd5Plugin = require('webpack-md5-hash')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ModuleHtmlPlugin = require('./packages/html-esmodules-plugin')

/*
 * SplitChunksPlugin is enabled by default and replaced
 * deprecated CommonsChunkPlugin. It automatically identifies modules which
 * should be splitted of chunk by heuristics using module duplication count and
 * module category (i. e. node_modules). And splits the chunks…
 *
 * It is safe to remove "splitChunks" from the generated configuration
 * and was added as an educational example.
 *
 * https://webpack.js.org/plugins/split-chunks-plugin/
 *
 */

module.exports = {
	entry: {
		main: './src/index.js'
	},

	output: {
		filename: 'js/[name]-legacy.[chunkhash:8].js',
		chunkFilename: 'js/[name]-legacy.[chunkhash:8].chunk.js',
	},
	module: {
		rules: [
			{
				include: [path.resolve(__dirname, 'src')],
				loader: 'babel-loader',
				test: /\.js$/,
				options: {
					"plugins": ["@babel/plugin-syntax-dynamic-import"],
					presets: [
						[
							"@babel/preset-env",
							{
								"modules": false,
								"useBuiltIns": 'usage'
							}
						],	
					]
				}
			}
		]
	},
	plugins: [
		new BundleAnalyzerPlugin({
			analyzerPort: 8888
		}),
		new WebpackMd5Plugin(),
		new HtmlWebpackPlugin({
			inject: 'body',
			// template: './public/index.html',
			template: './dist/index.html' ,
			
			minify: {
			  removeComments: true,
			  collapseWhitespace: true,
			  removeRedundantAttributes: true,
			  useShortDoctype: true,
			  removeEmptyAttributes: true,
			  removeStyleLinkTypeAttributes: true,
			  keepClosingSlash: true,
			  minifyJS: true,
			  minifyCSS: true,
			  minifyURLs: true,
			},
		  }),
		new ModuleHtmlPlugin(false)  

	],
	mode: 'production',
	devtool: 'sourcemap',
	optimization: {
		runtimeChunk: true,

		splitChunks: {
			cacheGroups: {
				commons: {
				  test: /[\\/]node_modules[\\/]/,
				  name: 'vendors',
				  chunks: 'all'
				}
			}
		},
	}
	
};
