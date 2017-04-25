/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { reduce, defaults, isEqual, omit } from 'lodash';
import stringify from 'fast-stable-stringify';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import {
	DONE_CREATE,
	DONE_UPDATE,
	DONE_DELETE,
	DONES_RECEIVE
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

function received( state = {}, action ) {
	switch ( action.type ) {
		case DONES_RECEIVE:
			const { query } = action;
			if ( ! query ) {
				break;
			}

			return {
				...state,
				[ stringify( query ) ]: true
			};
	}

	return state;
}

export default combineReducers( {
	items,
	received
} );
