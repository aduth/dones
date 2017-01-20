/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { reduce, defaults, isEqual, omit } from 'lodash';

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
			return reduce( action.dones, ( memo, done ) => {
				if ( isEqual( memo[ done.id ], done ) ) {
					return memo;
				}

				if ( memo === state ) {
					memo = { ...state };
				}

				memo[ done.id ] = done;
				return memo;
			}, state );

		case DONE_CREATE: {
			const { date, text, done, transientId } = action;
			return {
				...state,
				[ transientId ]: {
					user: USER_ID,
					date,
					text,
					done
				}
			};
		}

		case DONE_UPDATE: {
			const { id, date, text, done, replaceId } = action;
			const item = defaults( {
				date,
				text,
				done
			}, state[ id ], state[ replaceId ] );

			if ( isEqual( state[ id ], item ) ) {
				return state;
			}

			const nextState = { ...state, [ id ]: item };
			delete nextState[ replaceId ];
			return nextState;
		}

		case DONE_DELETE:
			return omit( state, action.id );
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

function received( state = {}, action ) {
	switch ( action.type ) {
		case DONES_RECEIVE:
			const { date } = action;
			if ( ! date ) {
				break;
			}

			return {
				...state,
				[ date ]: true
			};
	}

	return state;
}

export default combineReducers( {
	items,
	requesting,
	received
} );
