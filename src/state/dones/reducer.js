/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { isEqual, get, pick, groupBy, merge } from 'lodash';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import {
	DONE_CREATE,
	DONE_UPDATE,
	DONE_DELETE,
	DONES_RECEIVE,
	DONES_REQUEST,
	DONES_REQUEST_FAILURE,
	DONES_REQUEST_SUCCESS
} from 'state/action-types';

function items( state = {}, action ) {
	switch ( action.type ) {
		case DONES_RECEIVE:
			if ( isEqual( get( state, action.date ), action.dones ) ) {
				return state;
			}

			return {
				...state,
				[ action.date ]: groupBy( action.dones, 'user' )
			};

		case DONE_CREATE:
		case DONE_UPDATE: {
			const dones = [ ...get( state, [ action.date, USER_ID ], [] ) ];
			const index = DONE_CREATE === action.type ? dones.length : action.index;

			dones[ index ] = {
				...pick( action, 'text', 'done' ),
				user: USER_ID
			};

			return merge( {}, state, {
				[ action.date ]: {
					[ USER_ID ]: dones
				}
			} );
		}

		case DONE_DELETE: {
			const dones = [ ...get( state, [ action.date, USER_ID ] ) ];
			dones.splice( action.index, 1 );

			return {
				...state,
				[ action.date ]: {
					...state[ action.date ],
					[ USER_ID ]: dones
				}
			};
		}
	}

	return state;
}

function requesting( state = {}, action ) {
	switch ( action.type ) {
		case DONES_REQUEST:
		case DONES_REQUEST_FAILURE:
		case DONES_REQUEST_SUCCESS:
			const isRequesting = DONES_REQUEST === action.type;
			if ( state[ action.date ] === isRequesting ) {
				return state;
			}

			return {
				...state,
				[ action.date ]: isRequesting
			};
	}

	return state;
}

export default combineReducers( {
	items,
	requesting
} );
