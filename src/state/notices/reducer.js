/**
 * External dependencies
 */
import { omit } from 'lodash';

/**
 * Internal dependencies
 */
import { NOTICE_DISPLAY, NOTICE_HIDE } from 'state/action-types';

/**
 * Returns the updated notices state after an action has been dispatched. Each
 * notice is keyed by a unique identifier and is an object shaped with text and
 * status properties.
 *
 * @param  {Object} state  Current state
 * @param  {Object} action Action object
 * @return {Object}        Updated state
 */
export default function( state = {}, action ) {
	switch ( action.type ) {
		case NOTICE_DISPLAY:
			return {
				...state,
				[ action.id ]: {
					status: action.status,
					text: action.text,
				},
			};

		case NOTICE_HIDE:
			// Return original reference if ID not known
			if ( ! state.hasOwnProperty( action.id ) ) {
				return state;
			}

			return omit( state, action.id );
	}

	return state;
}
