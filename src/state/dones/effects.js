/**
 * Internal dependencies
 */
import {
	DONE_CREATE,
	DONE_DELETE,
	DONE_UPDATE,
	DONES_REQUEST,
	REQUEST
} from 'state/action-types';
import { receiveDones, updateDone } from 'state/dones/actions';

export default {
	[ DONES_REQUEST ]( action ) {
		const { query } = action;

		return {
			type: REQUEST,
			path: '/dones/v1/dones',
			query,
			success: ( dones ) => receiveDones( dones, query )
		};
	},
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
