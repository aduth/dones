/**
 * External dependencies
 */
import { uniqueId } from 'lodash';

/**
 * Internal dependencies
 */
import {
	DONE_CREATE,
	DONE_DELETE,
	DONE_UPDATE,
	DONES_RECEIVE,
	REQUEST
} from 'state/action-types';

export function receiveDones( dones, query ) {
	return {
		type: DONES_RECEIVE,
		dones,
		query
	};
}

export function requestDones( query ) {
	return {
		type: REQUEST,
		path: '/dones/v1/dones',
		query,
		success: ( dones ) => receiveDones( dones, query )
	};
}

export function createDone( date, text, done ) {
	return {
		type: DONE_CREATE,
		transientId: uniqueId( 'done' ),
		date,
		text,
		done
	};
}

export function updateDone( id, text, done, replaceId ) {
	return {
		type: DONE_UPDATE,
		id,
		text,
		done,
		replaceId
	};
}

export function deleteDone( id ) {
	return {
		type: DONE_DELETE,
		id
	};
}
