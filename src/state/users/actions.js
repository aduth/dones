/**
 * Internal dependencies
 */
import { USERS_RECEIVE, USERS_REQUEST } from 'state/action-types';

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
