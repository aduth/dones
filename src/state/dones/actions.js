/**
 * External dependencies
 */
import { stringify as stringifyQuery } from 'querystring';
import { uniqueId } from 'lodash';

/**
 * Internal dependencies
 */
import { API_ROOT } from 'constant';
import {
	DONE_CREATE,
	DONE_DELETE,
	DONE_TOGGLE,
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
	const path = `${ API_ROOT }/dones/v1/dones?${ stringifyQuery( query ) }`;

	return {
		type: REQUEST,
		url: path,
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
