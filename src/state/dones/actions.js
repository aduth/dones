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
	DONE_TOGGLE,
	DONE_UPDATE,
	DONES_RECEIVE,
	DONES_REQUEST
} from 'state/action-types';

export function receiveDones( dones, date ) {
	return {
		type: DONES_RECEIVE,
		dones,
		date
	};
}

export function requestDones( date ) {
	return {
		type: DONES_REQUEST,
		date
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

export function toggleDone( id ) {
	return {
		type: DONE_TOGGLE,
		id
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
