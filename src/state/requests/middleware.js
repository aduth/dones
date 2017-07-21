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
import callbackify from 'lib/callbackify';
import {
	getPreloadedResponse,
	getRequestNonce,
	isCapturingRequestPreload,
	isPreloadingPath,
	getPathRequest
} from 'state/selectors';
import {
	addPreloadedResponse,
	setRequestNonce,
	setPathRequest,
	setPathIsPreloading
} from './actions';

export default ( { dispatch, getState } ) => {
	/**
	 * Given a Fetch promise, returns the formatted response result.
	 *
	 * @param  {Promise} request Fetch request
	 * @return {Object}          Response result
	 */
	async function getFormattedResponse( request ) {
		const response = await request;
		const headers = fromPairs( [ ...response.headers.entries() ] );
		const result = { headers };
		result.body = await response.json();
		return result;
	}

	/**
	 * Given request path and parameters, attempts to attain the result of the
	 * request, yielding possible entries from preload, a deferred in-flight
	 * request, or finally from the result of a new Fetch request.
	 *
	 * @see getFormattedResponse
	 *
	 * @param {String}   path     Request path
	 * @param {Object}   params   Request fetch parameters
	 * @param {Function} callback Node-style callback to trigger with result
	 */
	function getResult( path, params, callback ) {
		const state = getState();

		// Clone parameters with defaults
		params = assign( {
			method: 'GET',
			headers: new Headers()
		}, params );

		if ( 'GET' === params.method ) {
			// First yield with potentially preloaded data
			const preloaded = getPreloadedResponse( state, path );
			if ( preloaded ) {
				callback( null, preloaded );
				return;
			}

			const inFlightRequest = getPathRequest( state, path );
			if ( inFlightRequest ) {
				// If an in-flight request exists, reset preloading flag to
				// ensure success handlers invoked immediately. This can occur
				// if a non-preload request is invoked while preload request is
				// already in-flight.
				dispatch( setPathIsPreloading( path, false ) );
				callbackify( getFormattedResponse( inFlightRequest ), callback );
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
		const request = fetch( API_ROOT + path, params );
		dispatch( setPathRequest( path, params, request ) );
		callbackify( getFormattedResponse( request ), callback );
	}

	/**
	 * Given an action object of type REQUEST, iterates through possible
	 * response results until one is found, at which point either a success
	 * handler is dispatched or the response is stored in preload data.
	 *
	 * @see getResult
	 *
	 * @param {Object} action Request action object
	 */
	function handleRequest( action ) {
		const { path, params, success, failure } = action;

		getResult( path, params, ( error, result ) => {
			if ( error ) {
				if ( failure ) {
					dispatch( failure( error ) );
				}
			} else {
				if ( isPreloadingPath( getState(), path ) ) {
					// If request is for preload purpose only, queue as such
					dispatch( addPreloadedResponse( path, result ) );
				} else if ( success ) {
					// Otherwise dispatch as success immediately
					dispatch( success( result ) );
				}

				// Set next request nonce from response headers
				const { 'x-wp-nonce': nonce } = result.headers;
				if ( nonce ) {
					dispatch( setRequestNonce( nonce ) );
				}
			}

			dispatch( {
				...action,
				type: REQUEST_COMPLETE,
				result
			} );
		} );
	}

	return ( next ) => ( action ) => {
		const { type, query } = action;
		if ( REQUEST === type ) {
			// Append query string
			const querystring = stringify( query );
			if ( querystring ) {
				action.path += '?' + querystring;
			}

			// Assign flag for considering request completion as intended for
			// preload if capturing requests for preload
			if ( isCapturingRequestPreload( getState() ) ) {
				dispatch( setPathIsPreloading( action.path, true ) );
			}

			handleRequest( action );
		}

		return next( action );
	};
};
