/**
 * External dependencies
 */
import { uniq, without } from 'lodash';

/**
 * Internal dependencies
 */
import { TAGS_RECEIVE, DONE_CREATE, DONE_UPDATE } from 'state/action-types';

export default function( state = null, action ) {
	switch ( action.type ) {
		case TAGS_RECEIVE:
			return uniq( ( state || [] ).concat( action.tags ) );

		case DONE_CREATE:
		case DONE_UPDATE:
			const pattern = /(^|\s)#(\S+)/g;

			let match;
			while ( ( match = pattern.exec( action.text ) ) ) {
				const [ , , tag ] = match;
				state = [ tag, ...without( state, tag ) ];
			}

			return state;
	}

	return state;
}
