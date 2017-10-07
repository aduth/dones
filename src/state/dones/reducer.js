/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { reduce, defaults, isEqual, omit, map } from 'lodash';
import stringify from 'fast-stable-stringify';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import {
	DONE_CREATE,
	DONE_CREATE_FAILURE,
	DONE_UPDATE,
	DONE_DELETE,
	DONES_RECEIVE,
} from 'state/action-types';

export function items( state = {}, action ) {
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
					id: transientId,
					user: USER_ID,
					date,
					text,
					done,
				},
			};
		}

		case DONE_UPDATE: {
			const { id, date, text, done, replaceId } = action;
			const item = defaults( {
				id,
				date,
				text,
				done,
			}, state[ id ], state[ replaceId ] );

			if ( isEqual( state[ id ], item ) ) {
				return state;
			}

			const nextState = { ...state, [ id ]: item };
			delete nextState[ replaceId ];
			return nextState;
		}

		case DONE_CREATE_FAILURE:
		case DONE_DELETE:
			return omit( state, action.transientId || action.id );
	}

	return state;
}

export function pages( state = {}, action ) {
	switch ( action.type ) {
		case DONES_RECEIVE:
			const { query } = action;
			if ( ! query ) {
				break;
			}

			// To group by page, first extract page property from query
			const { page = 1, ...querySansPage } = query;

			// Then serialize remainder of query to generate key
			const stringifiedQuery = stringify( querySansPage );
			const currentPages = state[ stringifiedQuery ];

			// Page will be one-based. Decrement to track at zero-based index.
			const index = page - 1;

			// Preserve state reference if page matches current value
			const ids = map( action.dones, 'id' );
			if ( currentPages && isEqual( ids, currentPages[ index ] ) ) {
				return state;
			}

			// Clone current state or initialize new array
			const nextPages = currentPages ? [ ...currentPages ] : [];
			nextPages[ page - 1 ] = ids;

			return {
				...state,
				[ stringifiedQuery ]: nextPages,
			};
	}

	return state;
}

/**
 * Returns next state, tracking received dones by query.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @return {Object}        Next state
 */
export function received( state = {}, action ) {
	switch ( action.type ) {
		case DONES_RECEIVE:
			const { query } = action;
			if ( ! query ) {
				break;
			}

			return {
				...state,
				[ stringify( query ) ]: true,
			};
	}

	return state;
}

export function totalPages( state = {}, action ) {
	switch ( action.type ) {
		case DONES_RECEIVE:
			const { query, totalPages: total } = action;
			if ( ! query || ! Number.isInteger( total ) ) {
				break;
			}

			return {
				...state,
				[ stringify( omit( query, 'page' ) ) ]: total,
			};
	}

	return state;
}

export default combineReducers( {
	items,
	pages,
	received,
	totalPages,
} );
