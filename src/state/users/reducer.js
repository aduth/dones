/**
 * External dependencies
 */
import { reduce, isEqual } from 'lodash';

/**
 * Internal dependencies
 */
import { USERS_RECEIVE } from 'state/action-types';

export default function( state = null, action ) {
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
