/**
 * External dependencies
 */

const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const config = module.exports = {
	entry: {
		app: [
			'./src/index.js'
		],
		vendor: [
			'autosize',
			'classnames',
			'fast-stable-stringify',
			'flatpickr',
			'path-to-regexp',
			'preact',
			'preact-redux',
			'refx',
			'textarea-caret'
		]
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name].js',
		publicPath: '/'
	},
	resolve: {
		modules: [ 'src', 'node_modules' ]
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [ 'babel-loader' ],
				exclude: /node_modules/
			}
		]
	},
	plugins: [
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( process.env.NODE_ENV )
		} ),
		new webpack.optimize.CommonsChunkPlugin( {
			name: 'vendor'
		} ),
		new webpack.LoaderOptionsPlugin( {
			minimize: process.env.NODE_ENV === 'production',
			debug: process.env.NODE_ENV !== 'production'
		} )
	]
};

if ( 'production' === process.env.NODE_ENV ) {
	config.module.rules.push( {
		test: /\.s?css$/,
		loader: ExtractTextPlugin.extract( {
			use: [
				'postcss-loader',
				{
					loader: 'sass-loader',
					query: {
						outputStyle: 'compressed'
					}
				}
			]
		} )
	} );

	config.plugins.push(
		new webpack.optimize.UglifyJsPlugin( {
			comments: false
		} ),
		new ExtractTextPlugin( {
			filename: './style.css',
			disable: false,
			allChunks: true
		} )
	);
} else {
	config.devtool = 'cheap-module-source-map';
	config.entry.app.push( 'preact/devtools' );
	config.module.rules.push( {
		test: /\.s?css$/,
		use: [
			'style-loader',
			'css-loader',
			'postcss-loader',
			'sass-loader'
		]
	} );
}
