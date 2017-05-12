/**
 * External dependencies
 */
import stringify from 'fast-stable-stringify';
import { get, omit, filter, every, includes } from 'lodash';

/**
 * Returns an array of dones for a given query, or null if dones have not been
 * received.
 *
 * @param  {Object} state Global state object
 * @param  {Object} query Query object
 * @return {?Array}       Dones, or null if not known
 */
export default function getDones( state, query = {} ) {
	const { items, pages } = state.dones;

	let pageIds;
	if ( query.page ) {
		pageIds = get( pages, [
			stringify( omit( query, 'page' ) ),
			query.page - 1
		] );
	}

	return filter( items, ( item ) => {
		return every( query, ( value, key ) => {
			if ( undefined === value ) {
				return true;
			}

			switch ( key ) {
				case 'date':
					return value === item.date.split( ' ' )[ 0 ];

				case 'page':
					return includes( pageIds, item.id );

				case 'tag':
					const tag = '#' + value.toLowerCase();
					const text = item.text.toLowerCase();
					return includes( text.split( ' ' ), tag );

				default:
					return true;
			}
		} );
	} );
}
