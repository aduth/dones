/**
 * External dependencies
 */
import { stringify } from 'querystringify';
import { assign, isPlainObject, pick } from 'lodash';

/**
 * Internal dependencies
 */
import { API_ROOT } from 'constant';
import { REQUEST, REQUEST_COMPLETE } from 'state/action-types';
import { getPreloadedResponse, getRequestNonce, isRequestingPath } from 'state/selectors';

export default ( { dispatch, getState } ) => {
	async function* getResult( path, params ) {
		const state = getState();

		// Clone parameters with defaults
		params = assign( {
			method: 'GET',
			headers: new Headers()
		}, params );

		if ( 'GET' === params.method ) {
			// First yield with potentially preloaded data
			yield getPreloadedResponse( state, path );

			// If network request in progress, abort iterating
			if ( isRequestingPath( state, path ) ) {
				return;
			}
		}

		// Append current nonce if exists
		const nonce = getRequestNonce( state );
		if ( nonce ) {
			params.credentials = 'include';
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

		// Trigger and await network request
		const response = await fetch( API_ROOT + path, params );
		yield await response.json();
	}

	async function handleRequest( action ) {
		const { path, params, success, failure } = action;

		try {
			let result;
			for await ( result of getResult( path, params ) ) {
				// Continue generator if yield produced no result
				if ( ! result ) {
					continue;
				}

				// Otherwise, assume completion and dispatch success
				if ( success ) {
					dispatch( success( result ) );
				}

				dispatch( {
					...action,
					type: REQUEST_COMPLETE,
					...pick( result, 'headers' )
				} );

				// Stop iteration once result yielded
				return;
			}
		} catch ( error ) {
			if ( failure ) {
				dispatch( failure( error ) );
			}
		}
	}

	return ( next ) => ( action ) => {
		const { type, query } = action;
		if ( REQUEST === type ) {
			// Append query string
			const querystring = stringify( query );
			if ( querystring ) {
				action.path += '?' + querystring;
			}

			handleRequest( action );
		}

		return next( action );
	};
};
