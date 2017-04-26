/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { omit } from 'lodash';

/**
 * Internal dependencies
 */
import { API_NONCE, PRELOADED_REQUESTS } from 'constant';
import { REQUEST, REQUEST_COMPLETE, REQUEST_PRELOAD_UNSET } from 'state/action-types';

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

export function preload( state = PRELOADED_REQUESTS, action ) {
	switch ( action.type ) {
		case REQUEST_PRELOAD_UNSET:
			return omit( state, action.path );
	}

	return state;
}

export function nonce( state = API_NONCE, action ) {
	switch ( action.type ) {
		case REQUEST_COMPLETE:
			const { headers } = action;
			if ( ! headers || ! headers.has( 'X-WP-Nonce' ) ) {
				return state;
			}

			return headers.get( 'X-WP-Nonce' );
	}

	return state;
}

export default combineReducers( {
	items,
	preload,
	nonce
} );
