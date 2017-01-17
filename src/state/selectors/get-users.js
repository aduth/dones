/**
 * External dependencies
 */
import { values } from 'lodash';

export default function getUsers( state ) {
	return values( state.users.items );
}
