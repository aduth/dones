/**
 * External dependencies
 */
import { filter } from 'lodash';

/**
 * Internal dependencies
 */
import { getDones } from './';

/**
 * Returns dones filtered by query and user ID.
 *
 * @param  {Object}  state  Global state object
 * @param  {Object}  query  Query object to filter
 * @param  {Number}  userId User ID to filter
 * @return {?Object}        Dones, or null if not known
 */
export default function getDonesForUser( state, query, userId ) {
	const dones = getDones( state, query );
	if ( ! dones ) {
		return null;
	}

	return filter( dones, { user: userId } );
}
