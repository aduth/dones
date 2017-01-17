/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Internal dependencies
 */
import { getUserDones } from './';

export default function getUserDone( state, userId, date, index ) {
	return get( getUserDones( state, userId, date ), index, null );
}
