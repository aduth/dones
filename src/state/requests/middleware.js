/**
 * External dependencies
 */
import { stringify } from 'querystringify';
import { assign, isPlainObject, fromPairs } from 'lodash';

/**
 * Internal dependencies
 */
import { API_ROOT } from 'constant';
import { REQUEST, REQUEST_COMPLETE } from 'state/action-types';
import { getPreloadedResponse, getRequestNonce, isRequestingPath } from 'state/selectors';
import { setRequestNonce } from './actions';

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
		const headers = fromPairs( [ ...response.headers.entries() ] );
		const result = { headers };
		result.body = await response.json();
		yield result;
	}

	async function handleRequest( action ) {
		const { path, params, success, failure } = action;

		let result;
		try {
			for await ( result of getResult( path, params ) ) {
				// Continue generator if yield produced no result
				if ( ! result ) {
					continue;
				}

				// Otherwise, assume completion and dispatch success
				if ( success ) {
					dispatch( success( result ) );
				}

				// Set next request nonce from response headers
				const { 'x-wp-nonce': nonce } = result.headers;
				if ( nonce ) {
					dispatch( setRequestNonce( nonce ) );
				}

				// Stop iteration once result yielded
				break;
			}
		} catch ( error ) {
			if ( failure ) {
				dispatch( failure( error ) );
			}
		} finally {
			dispatch( {
				...action,
				type: REQUEST_COMPLETE,
				result
			} );
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
