/**
 * Internal dependencies
 */
import { REQUEST, USERS_REQUEST } from 'state/action-types';
import { receiveUsers } from 'state/users/actions';

export default {
	[ USERS_REQUEST ]() {
		return {
			type: REQUEST,
			path: '/dones/v1/users',
			success: receiveUsers
		};
	}
};
