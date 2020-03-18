/**
 * External dependencies
 */

const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const { BUILD_TARGET, NODE_ENV = 'development' } = process.env;

/** @type {import('webpack').Configuration} */
const config = module.exports = {
	mode: NODE_ENV,
	entry: './src/index.js',
	output: {
		path: __dirname + '/dist',
		filename: 'app' + ( BUILD_TARGET ? '-' + BUILD_TARGET : '' ) + '.js',
		publicPath: '/',
	},
	resolve: {
		modules: [ 'src', 'node_modules' ],
		alias: {
			lodash: 'lodash-es',
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

	// The Wayfarer module uses `assert` to validate incoming arguments. This
	// is a non-trivial dependency, and not desirable for production.
	config.module.rules.unshift( {
		test: /\.js$/,
		use: {
			loader: 'babel-loader',
			options: {
				babelrc: false,
				plugins: [ 'unassert' ],
			},
		},
		include: __dirname + '/node_modules/wayfarer',
	} );

	config.module.rules.push( {
		test: /\.s?css$/,
		use: ExtractTextPlugin.extract( {
			use: [
				'postcss-loader',
				{
					loader: 'sass-loader',
					options: {
						sassOptions: {
							outputStyle: 'compressed',
						},
					},
				},
			],
		} ),
	} );

	config.plugins = [
		new ExtractTextPlugin( {
			filename: './style.css',
			disable: false,
			allChunks: true,
		} ),
	];
} else if ( 'development' === NODE_ENV ) {
	config.devtool = 'cheap-module-source-map';
	config.entry = [ 'preact/debug', config.entry ];
	config.resolve.alias.preact$ = 'preact/src/index.js';
	config.resolve.alias[ 'preact/compat$' ] = 'preact/compat/src/index.js';
	config.resolve.alias[ 'preact/debug$' ] = 'preact/debug/src/index.js';
	config.resolve.alias[ 'preact/devtools$' ] = 'preact/devtools/src/index.js';
	config.resolve.alias[ 'preact/hooks$' ] = 'preact/hooks/src/index.js';
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
