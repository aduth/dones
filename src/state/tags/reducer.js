/**
 * External dependencies
 */
import { includes } from 'lodash';

/**
 * Internal dependencies
 */
import {
	TAGS_RECEIVE,
	DONE_CREATE,
	DONE_UPDATE,
} from 'state/action-types';

export default function( state = null, action ) {
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
					state = ( state || [] ).concat( tag );
				}
			}

			return state;
	}

	return state;
}
