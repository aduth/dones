/**
 * External dependencies
 */
import { sortBy } from 'lodash';
import createSelector from 'rememo';

/**
 * Internal dependencies
 */
import { USER_ID } from 'constant';
import { getUsers, getDonesForUser } from './';

/**
 * Returns users for the specified date, by current user first, then users with
 * dones reported for the day, then by name.
 *
 * @param  {Object}   state Global state object
 * @param  {String}   date  Date to check for user dones
 * @return {Object[]}       Sorted users
 */
export function getSortedUsersByDate( state, date ) {
	const users = getUsers( state );

	return sortBy( users, [
		// By current user:
		( { id } ) => id === USER_ID ? 0 : 1,

		// By dones for user by date, negating since default sort is ascending,
		// so those with more dones should be more negative:
		( { id } ) => -1 * getDonesForUser( state, { date }, id ).length,

		// By alphabetical name:
		'name',
	] );
}

export default createSelector(
	getSortedUsersByDate,
	( state ) => [ state.dones, state.users ]
);
