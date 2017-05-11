/**
 * External dependencies
 */
import stringify from 'fast-stable-stringify';
import { get, map } from 'lodash';

/**
 * Internal dependencies
 */
import { getDone } from './';

/**
 * Returns an array of dones for a given query, or null if dones have not been
 * received.
 *
 * @param  {Object}    state         Global state object
 * @param  {Number}    options.page  Query page
 * @param  {...Object} options.query Query object
 * @return {?Object}                 Dones, or null if not known
 */
export default function getDones( state, { page = 1, ...query } ) {
	const { pages } = state.dones;
	const ids = get( pages, [ stringify( query ), page - 1 ] );
	if ( ! ids ) {
		return null;
	}

	return map( ids, ( id ) => getDone( state, id ) );
}
