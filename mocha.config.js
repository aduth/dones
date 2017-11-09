// Fake DOM
require( 'browser-env' )();

// Chai plugins
require( 'chai' )
	.use( require( 'sinon-chai' ) );

// Constant initialization
global.dones = {
	siteUrl: 'http://example.com',
	userId: 1,
};
