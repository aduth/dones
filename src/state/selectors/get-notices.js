/**
 * External dependencies
 */
import createSelector from 'rememo';
import { map } from 'lodash';

/**
 * Returns an array of all active notices.
 *
 * @param  {Object}   state Global state object
 * @return {Object[]}       Notices
 */
export function getNotices( state ) {
	return map( state.notices, ( notice, id ) => ( { ...notice, id } ) );
}

export default createSelector(
	getNotices,
	( state ) => state.notices
);
