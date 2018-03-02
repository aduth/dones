/**
 * External dependencies
 */

const ExtractTextPlugin = require( 'extract-text-webpack-plugin' );

const { BUILD_TARGET, NODE_ENV } = process.env;

const config = module.exports = {
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
					query: {
						outputStyle: 'compressed',
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
} else {
	config.devtool = 'cheap-module-source-map';
	config.entry = [ config.entry, 'preact/devtools' ];
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
