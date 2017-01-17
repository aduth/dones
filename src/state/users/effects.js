/**
 * External dependencies
 */
import { map, last, values } from 'lodash';

/**
 * Internal dependencies
 */
import Request from 'lib/request';
import {
	USERS_REQUEST,
	USERS_REQUEST_FAILURE,
	USERS_REQUEST_SUCCESS
} from 'state/action-types';
import { isRequestingUsers } from 'state/selectors';
import { receiveUsers } from 'state/users/actions';

export default {
	[ USERS_REQUEST ]: async ( store ) => {
		const state = store.getState();
		if ( isRequestingUsers( state ) ) {
			return;
		}

		try {
			const response = await Request.get( '/wp/v2/users' );
			const users = map( response, ( user ) => {
				return {
					id: user.id,
					name: user.name,
					avatar: last( values( user.avatar_urls ) )
				};
			} );

			store.dispatch( receiveUsers( users ) );
			store.dispatch( { type: USERS_REQUEST_SUCCESS } );
		} catch ( error ) {
			store.dispatch( { type: USERS_REQUEST_FAILURE, error } );
		}
	}
};
