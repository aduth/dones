module.exports = {
	plugins: [
		require( 'autoprefixer' ),
		require( 'postcss-critical-css' )( {
			outputPath: 'dist',
			outputDest: 'critical.css.php',
		} ),
	],
};
