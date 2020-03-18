/**
 * External dependencies
 */
import createSelector from 'rememo';
import stringify from 'fast-stable-stringify';
import { get, omit } from 'lodash';

/**
 * Returns the total number of pages for the given query, or null if the page
 * count is not yet known.
 *
 * @param  {Object}  state Global state object
 * @param  {Object}  query Query object
 * @return {?number}       Page count if known
 */
export function getDonesTotalPages( state, query ) {
	query = stringify( omit( query, 'page' ) );
	return get( state.dones.totalPages, query, null );
}

export default createSelector(
	getDonesTotalPages,
	( state ) => [ state.dones.totalPages ]
);
