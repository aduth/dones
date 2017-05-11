/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { omit, mapValues, mapKeys } from 'lodash';

/**
 * Internal dependencies
 */
import {
	REQUEST,
	REQUEST_COMPLETE,
	REQUEST_NONCE_SET,
	REQUEST_PRELOAD_SET,
	REQUEST_PRELOAD_CLEAR
} from 'state/action-types';

export function items( state = {}, action ) {
	switch ( action.type ) {
		case REQUEST:
		case REQUEST_COMPLETE:
			const { type, path, params = {} } = action;
			const { method = 'GET' } = params;
			if ( 'GET' !== method ) {
				return state;
			} else if ( REQUEST_COMPLETE === type ) {
				return omit( state, path );
			}

			return { ...state, [ path ]: true };

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
		case REQUEST_PRELOAD_SET:
			// Response header keys are normalized to lowercase because of
			// inconsistent casing between Fetch's `entries` iterator and
			// WordPress REST API response headers keys
			const { responses } = action;
			return mapValues( responses, ( response ) => ( {
				...response,
				headers: mapKeys(
					response.headers,
					( value, key ) => key.toLowerCase()
				)
			} ) );

		case REQUEST_PRELOAD_CLEAR:
			return {};
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

export default combineReducers( {
	items,
	preload,
	nonce
} );
