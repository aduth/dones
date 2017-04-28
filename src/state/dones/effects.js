/**
 * Internal dependencies
 */
import {
	DONE_CREATE,
	DONE_DELETE,
	DONE_UPDATE,
	REQUEST
} from 'state/action-types';
import { updateDone } from 'state/dones/actions';

export default {
	[ DONE_CREATE ]( action ) {
		const { date, text, done, transientId } = action;

		return {
			type: REQUEST,
			path: '/dones/v1/dones',
			params: {
				method: 'POST',
				body: { date, text, done }
			},
			success( { id } ) {
				return updateDone( id, text, done, transientId );
			}
		};
	},
	[ DONE_DELETE ]( action ) {
		const { id } = action;

		return {
			type: REQUEST,
			path: `/dones/v1/dones/${ id }`,
			params: {
				method: 'DELETE'
			}
		};
	},
	[ DONE_UPDATE ]( action ) {
		const { id, text, done } = action;

		return {
			type: REQUEST,
			path: `/dones/v1/dones/${ id }`,
			params: {
				method: 'PUT',
				body: { text, done }
			}
		};
	}
};
