/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { ROUTE_PUSH, ROUTE_REPLACE } from 'state/action-types';

/**
 * Returns the updated path fetching state after an action has been dispatched.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @return {Object}        Updated state
 */
export function path( state = null, action ) {
	switch ( action.type ) {
		case ROUTE_PUSH:
		case ROUTE_REPLACE:
			return action.path;
	}

	return state;
}

/**
 * Returns the updated is initial state after an action has been dispatched.
 * Is initial reflects whether navigation has occurred within the app.
 *
 * @param  {boolean} state  Current state
 * @param  {Object}  action Action object
 * @return {boolean}        Updated state
 */
export function isInitial( state = true, action ) {
	switch ( action.type ) {
		case ROUTE_PUSH:
		case ROUTE_REPLACE:
			return ROUTE_REPLACE === action.type;
	}

	return state;
}

export default combineReducers( {
	path,
	isInitial,
} );
