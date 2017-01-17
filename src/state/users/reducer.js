/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { reduce, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import {
	USERS_RECEIVE,
	USERS_REQUEST,
	USERS_REQUEST_FAILURE,
	USERS_REQUEST_SUCCESS
} from 'state/action-types';

function items( state = null, action ) {
	switch ( action.type ) {
		case USERS_RECEIVE:
			return reduce( action.users, ( memo, user ) => {
				if ( isEqual( memo[ user.id ], user ) ) {
					return memo;
				}

				if ( memo === state ) {
					memo = { ...state };
				}

				memo[ user.id ] = user;
				return memo;
			}, state || {} );
	}

	return state;
}

function requesting( state = false, action ) {
	switch ( action.type ) {
		case USERS_REQUEST:
		case USERS_REQUEST_FAILURE:
		case USERS_REQUEST_SUCCESS:
			return USERS_REQUEST === action.type;
	}

	return state;
}

export default combineReducers( {
	items,
	requesting
} );
