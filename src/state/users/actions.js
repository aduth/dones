/**
 * Internal dependencies
 */
import { USERS_REQUEST, USERS_RECEIVE } from 'state/action-types';

export function requestUsers() {
	return {
		type: USERS_REQUEST
	};
}

export function receiveUsers( users ) {
	return {
		type: USERS_RECEIVE,
		users
	};
}
