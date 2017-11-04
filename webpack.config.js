/**
 * External dependencies
 */

const webpack = require( 'webpack' );
const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );
const UglifyJsPlugin = require( 'uglifyjs-webpack-plugin' );

const { BUILD_TARGET, NODE_ENV } = process.env;

const config = module.exports = {
	entry: {
		app: [
			'./src/index.js',
		],
		vendor: [
			'autosize',
			'classnames',
			'fast-stable-stringify',
			'flatpickr',
			'memize',
			'path-to-regexp',
			'preact',
			'preact-redux',
			'refx',
			'textarea-caret',
		],
	},
	output: {
		path: __dirname + '/dist',
		filename: '[name]' + ( BUILD_TARGET ? '-' + BUILD_TARGET : '' ) + '.js',
		publicPath: '/',
	},
	resolve: {
		modules: [ 'src', 'node_modules' ],
		alias: {
			'lodash-es': 'lodash',
		},
	},
	module: {
		rules: [
			{
				test: /\.js$/,
				use: [ 'babel-loader' ],
				exclude: /node_modules/,
			},
		],
	},
	plugins: [
		new webpack.DefinePlugin( {
			'process.env.NODE_ENV': JSON.stringify( NODE_ENV ),
		} ),
		new webpack.optimize.CommonsChunkPlugin( {
			name: 'vendor',
		} ),
		new webpack.LoaderOptionsPlugin( {
			minimize: NODE_ENV === 'production',
			debug: NODE_ENV !== 'production',
		} ),
	],
};

if ( 'production' === NODE_ENV ) {
	config.module.rules.unshift( {
		test: /\/action-types\.js$/,
		use: {
			loader: 'babel-loader',
			options: {
				plugins: [ 'minify-export-mirror' ],
			},
		},
		include: __dirname + '/src/state',
	} );

	config.module.rules.push( {
		test: /\.s?css$/,
		use: ExtractTextPlugin.extract( {
			use: [
				'postcss-loader',
				{
					loader: 'sass-loader',
					query: {
						outputStyle: 'compressed',
					},
				},
			],
		} ),
	} );

	config.plugins.push(
		new UglifyJsPlugin( {
			uglifyOptions: {
				output: {
					comments: false,
				},
			},
			cache: true,
			parallel: true,
		} ),
		new webpack.optimize.ModuleConcatenationPlugin(),
		new ExtractTextPlugin( {
			filename: './style.css',
			disable: false,
			allChunks: true,
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
			'sass-loader',
		],
	} );
}
