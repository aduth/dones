// Fake DOM
require( 'browser-env' )();

// Chai plugins
require( 'chai' )
	.use( require( 'sinon-chai' ) );

// Force synchronous Preact rerenders during test, allowing assertions to be
// made immediately following a rerender.
require( 'preact' ).options.debounceRendering = ( render ) => render();

// Constant initialization
global.dones = {
	siteUrl: 'http://example.com',
	userId: 1,
	i18n: {},
};
