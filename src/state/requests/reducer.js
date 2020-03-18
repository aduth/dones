/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { omit, reduce, mapValues, mapKeys } from 'lodash';

/**
 * Internal dependencies
 */
import {
	REQUEST_PATH_REQUEST_SET,
	REQUEST_COMPLETE,
	REQUEST_NONCE_SET,
	REQUEST_PRELOAD_ADD,
	REQUEST_PRELOAD_SET,
	REQUEST_PRELOAD_CLEAR,
	REQUEST_PRELOAD_CAPTURE_START,
	REQUEST_PRELOAD_CAPTURE_STOP,
	REQUEST_PATH_IS_PRELOADING_SET,
} from 'state/action-types';

/**
 * Returns next requests state, keyed by path, where each value is the request
 * object for an in-flight request.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @return {Object}        Next state
 */
export function items( state = {}, action ) {
	switch ( action.type ) {
		case REQUEST_PATH_REQUEST_SET: {
			const { path, request, params = {} } = action;
			const { method = 'GET' } = params;

			return {
				...state,
				[ path ]: {
					...state[ path ],
					[ method ]: request,
				},
			};
		}

		case REQUEST_COMPLETE: {
			const { path, params = {} } = action;
			const { method = 'GET' } = params;

			const nextPath = omit( state[ path ], method );
			if ( ! Object.keys( nextPath ).length ) {
				return omit( state, path );
			}

			return { ...state, [ path ]: nextPath };
		}
	}

	return state;
}

/**
 * Returns next request preloading state, keyed by path, reflecting whether a
 * request is in progress to preload data for path.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @return {Object}        Next state
 */
export function preloading( state = {}, action ) {
	switch ( action.type ) {
		case REQUEST_PATH_IS_PRELOADING_SET:
			// Bail if assigned value matches coerced state value (coerced
			// because false values are omitted)
			if ( action.isPreloading === !! state[ action.path ] ) {
				return state;
			}

			if ( action.isPreloading ) {
				return { ...state, [ action.path ]: true };
			}

			return omit( state, action.path );

		case REQUEST_PRELOAD_ADD:
			if ( state[ action.path ] ) {
				return omit( state, action.path );
			}

			return state;
	}

	return state;
}

/**
 * Returns next preloaded response data state (body, headers) keyed by path.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @return {Object}        Next state
 */
export function preload( state = {}, action ) {
	switch ( action.type ) {
		case REQUEST_PRELOAD_ADD:
		case REQUEST_PRELOAD_SET:
			// Reformat singular preload add as object of path: response
			let responses =
				REQUEST_PRELOAD_ADD === action.type
					? { [ action.path ]: action.response }
					: action.responses;

			// Structure responses as array of [ response, id ] where ID can be
			// used later in targeting the correctly timed preload to clear
			responses = mapValues( responses, ( response ) => [
				// Response:
				{
					...response,
					// Response header keys are normalized to lowercase due to
					// inconsistent casing between Fetch's `entries` iterator
					// and WordPress REST API response headers keys.
					headers: mapKeys( response.headers, ( value, key ) =>
						key.toLowerCase()
					),
				},

				// Transaction ID:
				action.id,
			] );

			if ( REQUEST_PRELOAD_ADD === action.type ) {
				return { ...state, ...responses };
			}

			return responses;

		case REQUEST_PRELOAD_CLEAR:
			// Singular clear
			if ( action.path ) {
				// Verify path is already tracked and matches ID
				if (
					state.hasOwnProperty( action.path ) &&
					state[ action.path ][ 1 ] === action.id
				) {
					return omit( state, action.path );
				}

				return state;
			}

			// Total clear
			return reduce(
				state,
				( result, preloaded, path ) => {
					const [ , id ] = preloaded;
					// Verify matches ID
					if ( id === action.id ) {
						// Avoid state mutation by creating shallow clone
						if ( result === state ) {
							result = { ...state };
						}

						// With clone, mutate as deleting path key
						delete result[ path ];
					}

					return result;
				},
				state
			);
	}

	return state;
}

/**
 * Returns next request nonce state.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @return {Object}        Next state
 */
export function nonce( state = null, action ) {
	switch ( action.type ) {
		case REQUEST_NONCE_SET:
			return action.nonce || null;
	}

	return state;
}

/**
 * Returns next preload capture state, reflecting whether requests are being
 * captured for preload.
 *
 * @param  {boolean} state  Current state
 * @param  {Object}  action Action object
 * @return {boolean}        Next state
 */
export function isCapturingPreload( state = false, action ) {
	switch ( action.type ) {
		case REQUEST_PRELOAD_CAPTURE_START:
			return true;

		case REQUEST_PRELOAD_CAPTURE_STOP:
			return false;
	}

	return state;
}

export default combineReducers( {
	items,
	preloading,
	preload,
	nonce,
	isCapturingPreload,
} );
