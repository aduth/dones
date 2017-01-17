/**
 * External dependencies
 */
import { combineReducers } from 'redux';
import { includes } from 'lodash';

/**
 * Internal dependencies
 */
import {
	TAGS_RECEIVE,
	TAGS_REQUEST,
	TAGS_REQUEST_FAILURE,
	TAGS_REQUEST_SUCCESS,
	DONE_CREATE,
	DONE_UPDATE
} from 'state/action-types';

function requesting( state = false, action ) {
	switch ( action.type ) {
		case TAGS_REQUEST:
		case TAGS_REQUEST_FAILURE:
		case TAGS_REQUEST_SUCCESS:
			return TAGS_REQUEST === action.type;
	}

	return state;
}

function items( state = null, action ) {
	switch ( action.type ) {
		case TAGS_RECEIVE:
			return action.tags;

		case DONE_CREATE:
		case DONE_UPDATE:
			const pattern = /(^|\s)#(\S+)\b/g;

			let match;
			while ( match = pattern.exec( action.text ) ) {
				const [ , , tag ] = match;
				if ( ! includes( state, tag ) ) {
					state = state.concat( tag );
				}
			}

			return state;
	}

	return state;
}

export default combineReducers( {
	requesting,
	items
} );
