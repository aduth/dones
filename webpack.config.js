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
			'date-fns',
			'flatpickr',
			'path-to-regexp',
			'preact',
			'preact-redux',
			'redux',
			'refx'
		]
	},
	output: {
		path: './dist',
		filename: '[name].js',
		publicPath: '/'
	},
	resolve: {
		extensions: [ '.js' ],
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
			debug: process.env.NODE_ENV !== 'production',
			options: {
				postcss: [
					require( 'autoprefixer' )
				]
			}
		} )
	],
	devtool: 'source-map'
};

if ( 'production' === process.env.NODE_ENV ) {
	config.module.rules.push( {
		test: /\.s?css$/,
		loader: ExtractTextPlugin.extract( {
			loader: [
				{ loader: 'raw-loader' },
				{ loader: 'postcss-loader' },
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
		new webpack.optimize.UglifyJsPlugin(),
		new ExtractTextPlugin( {
			filename: './style.css',
			disable: false,
			allChunks: true
		} )
	);
} else {
	config.module.rules.push( {
		test: /\.s?css$/,
		use: [
			{ loader: 'style-loader' },
			{ loader: 'css-loader' },
			{ loader: 'postcss-loader' },
			{ loader: 'sass-loader' }
		]
	} );
}
