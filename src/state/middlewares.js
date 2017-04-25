/**
 * External dependencies
 */
import refx from 'refx';

/**
 * Internal dependencies
 */
import routing from './routing/middleware';
import effects from './effects';

function fetchMiddleware( { dispatch } ) {
	const handleFetch = ( () => {
		const fetching = {};

		return ( action ) => {
			const { url, params = {} } = action;

			// If GET request and already in progress, abort.
			const { type = 'GET' } = params;
			if ( 'GET' === type ) {
				if ( fetching[ url ] ) {
					return;
				}

				fetching[ url ] = true;
			}

			const { success, failure } = action;
			fetch( url, params )
				.then( ( response ) => response.json() )
				.then(
					( body ) => success && dispatch( success( body ) ),
					( body ) => failure && dispatch( failure( body ) )
				)
				.then( () => delete fetching[ url ] );
		};
	} )();

	return ( next ) => ( action ) => {
		if ( 'FETCH' === action.type ) {
			handleFetch( action );
		}

		return next( action );
	};
}

export default [ refx( effects ), routing, fetchMiddleware ];
