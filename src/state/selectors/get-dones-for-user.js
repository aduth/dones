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
	return filter( getDones( state, query ), { user: userId } );
}
