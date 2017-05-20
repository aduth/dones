// Root-level hook to reset document contents before each test
beforeEach( () => {
	let child;
	while ( child = document.body.firstChild ) {
		document.body.removeChild( child );
	}
} );
