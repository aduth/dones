/**
 * Internal dependencies
 */
import {
	DONE_CREATE,
	DONE_DELETE,
	DONE_TOGGLE,
	DONE_UPDATE,
	REQUEST
} from 'state/action-types';
import { updateDone } from 'state/dones/actions';
import { getDone } from 'state/selectors';

export default {
	[ DONE_CREATE ]: ( { dispatch }, action ) => {
		const { date, text, done, transientId } = action;

		dispatch( {
			type: REQUEST,
			path: '/dones/v1/dones',
			params: {
				method: 'POST',
				body: { date, text, done }
			},
			success( { id } ) {
				return updateDone( id, text, done, transientId );
			}
		} );
	},
	[ DONE_DELETE ]: ( { dispatch }, { id } ) => {
		dispatch( {
			type: REQUEST,
			path: `/dones/v1/dones/${ id }`,
			params: {
				method: 'DELETE'
			}
		} );
	},
	[ DONE_TOGGLE ]: ( { getState, dispatch }, { id } ) => {
		const done = getDone( getState(), id );
		if ( done ) {
			dispatch( updateDone( id, done.text, ! done.done ) );
		}
	},
	[ DONE_UPDATE ]: ( { dispatch }, action ) => {
		const { id, text, done } = action;

		dispatch( {
			type: REQUEST,
			path: `/dones/v1/dones/${ id }`,
			params: {
				method: 'PUT',
				body: { text, done }
			}
		} );
	}
};
