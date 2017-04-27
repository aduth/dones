/**
 * External dependencies
 */
import { fromPairs, includes } from 'lodash';

/**
 * Internal dependencies
 */
import {
	TAGS_RECEIVE,
	DONE_CREATE,
	DONE_UPDATE
} from 'state/action-types';

export default function( state = null, action ) {
	switch ( action.type ) {
		case TAGS_RECEIVE:
			return fromPairs( action.tags );

		case DONE_CREATE:
		case DONE_UPDATE:
			const pattern = /(^|\s)#(\S+)\b/g;

			let nextState = state,
				match;

			while ( match = pattern.exec( action.text ) ) {
				if ( nextState === state ) {
					nextState = { ...state };
				}

				const tag = match[ 2 ];
				nextState[ tag ] = ( nextState[ tag ] || 0 ) + 1;
			}

			return nextState;
	}

	return state;
}
