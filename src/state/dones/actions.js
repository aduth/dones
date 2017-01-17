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

export function receiveDones( date, dones ) {
	return {
		type: DONES_RECEIVE,
		date,
		dones
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
		date,
		text,
		done
	};
}

export function toggleDone( date, index ) {
	return {
		type: DONE_TOGGLE,
		date,
		index
	};
}

export function updateDone( date, index, text, done ) {
	return {
		type: DONE_UPDATE,
		date,
		index,
		text,
		done
	};
}

export function deleteDone( date, index ) {
	return {
		type: DONE_DELETE,
		date,
		index
	};
}
