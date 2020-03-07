/**
 * External dependencies
 */
import createSelector from 'rememo';
import { values } from 'lodash';

/**
 * Returns an array of all site user objects with editable permissions.
 *
 * @param  {Object}   state Global state object
 * @return {Object[]}       Site users
 */
export function getUsers( state ) {
	return values( state.users );
}

export default createSelector(
	getUsers,
	( state ) => [ state.users ]
);
