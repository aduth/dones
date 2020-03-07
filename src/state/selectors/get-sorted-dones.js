/**
 * External dependencies
 */
import createSelector from 'rememo';
import { orderBy } from 'lodash';

/**
 * Internal dependencies
 */
import { getDones } from './';

/**
 * Returns dones sorted by the specified order and property.
 *
 * @param  {Object}   state    Global state object
 * @param  {Object}   query    Query object
 * @param  {String}   property Property on which to sort
 * @param  {String}   order    Direction in which to sort
 * @return {Object[]}          Ordered dones
 */
export function getSortedDones( state, query, property = 'date', order = 'desc' ) {
	return orderBy( getDones( state, query ), property, order );
}

export default createSelector(
	getSortedDones,
	( state ) => [ state.dones ]
);
