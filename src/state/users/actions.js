/**
 * Internal dependencies
 */
import { USERS_RECEIVE, REQUEST } from 'state/action-types';

export function requestUsers() {
	return {
		type: REQUEST,
		path: '/dones/v1/users',
		success: ( users ) => receiveUsers( users )
	};
}

export function receiveUsers( users ) {
	return {
		type: USERS_RECEIVE,
		users
	};
}
