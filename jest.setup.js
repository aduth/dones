// Force synchronous Preact rerenders during test, allowing assertions to be
// made immediately following a rerender.
require( 'preact' ).options.debounceRendering = ( render ) => render();

// Constant initialization
global.dones = {
	siteUrl: window.location.origin,
	userId: 1,
	i18n: {},
};

window.scrollTo = () => {};
