/**
 * External dependencies
 */
import createSelector from 'rememo';
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
 * @param  {number}  userId User ID to filter
 * @return {?Object}        Dones, or null if not known
 */
export function getDonesForUser( state, query, userId ) {
	return filter( getDones( state, query ), { user: userId } );
}

export default createSelector( getDonesForUser, ( state ) => [ state.dones ] );
