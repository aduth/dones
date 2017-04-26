/**
 * External dependencies
 */
import { map, last, values } from 'lodash';

/**
 * Internal dependencies
 */
import { USERS_RECEIVE, REQUEST } from 'state/action-types';

export function requestUsers() {
	return {
		type: REQUEST,
		path: '/wp/v2/users',
		success: ( users ) => {
			users = map( users, ( user ) => ( {
				id: user.id,
				name: user.name,
				avatar: last( values( user.avatar_urls ) )
			} ) );

			return receiveUsers( users );
		}
	};
}

export function receiveUsers( users ) {
	return {
		type: USERS_RECEIVE,
		users
	};
}
