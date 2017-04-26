/**
 * External dependencies
 */
import { stringify } from 'querystringify';
import { assign, isPlainObject, pick } from 'lodash';

/**
 * Internal dependencies
 */
import { REQUEST, REQUEST_COMPLETE, REQUEST_PRELOAD_UNSET } from 'state/action-types';
import { getPreloadedResponse, getRequestNonce, isRequestingUrl } from 'state/selectors';

export default ( { dispatch, getState } ) => {
	async function handleRequest( action ) {
		let { url } = action;
		const state = getState();
		const params = assign( {
			credentials: 'include',
			headers: new Headers()
		}, action.params );

		// Append query string
		if ( action.query ) {
			const querystring = stringify( action.query );
			if ( querystring ) {
				url += '?' + querystring;
			}
		}

		// Abort if GET request and already in progress
		const { method = 'GET' } = params;
		if ( 'GET' === method && isRequestingUrl( state, url ) ) {
			return;
		}

		// Append current nonce if exists
		const nonce = getRequestNonce( state );
		if ( nonce ) {
			params.headers.append( 'X-WP-Nonce', nonce );
		}

		// Append form contents
		if ( isPlainObject( params.body ) ) {
			params.headers.append(
				'Content-Type',
				'application/x-www-form-urlencoded'
			);

			params.body = stringify( params.body );
		}

		const { success, failure } = action;

		let response;
		try {
			let data;

			// Check if preload data already exists
			if ( 'GET' === method && ( data = getPreloadedResponse( state, url ) ) ) {
				// Use preload only once. Data is assigned in condition above.
				dispatch( {
					type: REQUEST_PRELOAD_UNSET,
					url
				} );
			} else {
				// Otherwise trigger network request.
				response = await fetch( url, params );
				data = await response.json();
			}

			if ( success ) {
				dispatch( success( data ) );
			}
		} catch ( error ) {
			if ( failure ) {
				dispatch( failure( error ) );
			}
		} finally {
			dispatch( {
				...action,
				type: REQUEST_COMPLETE,
				...pick( response, 'headers' )
			} );
		}
	}

	return ( next ) => ( action ) => {
		if ( REQUEST === action.type ) {
			handleRequest( action );
		}

		return next( action );
	};
};
