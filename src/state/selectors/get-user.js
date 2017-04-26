/**
 * External dependencies
 */
import { get } from 'lodash';

export default function getUser( state, userId ) {
	return get( state.users, userId, null );
}
