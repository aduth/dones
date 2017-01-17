/**
 * External dependencies
 */
import { combineReducers } from 'redux';

/**
 * Internal dependencies
 */
import { DOCUMENT_HEAD_TITLE_SET } from 'state/action-types';

export function title( state = null, action ) {
	switch ( action.type ) {
		case DOCUMENT_HEAD_TITLE_SET:
			return action.title;
	}

	return state;
}

export default combineReducers( {
	title
} );
