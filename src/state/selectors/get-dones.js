/**
 * External dependencies
 */
import { filter, every, startsWith, includes, endsWith } from 'lodash';

/**
 * Internal dependencies
 */
import { getDonesPage } from './';

export default function getDones( state, query ) {
	return filter( state.dones.items, ( item ) => {
		return every( query, ( value, key ) => {
			if ( undefined === value ) {
				return true;
			}

			switch ( key ) {
				case 'userId':
					return item.user === value;

				case 'date':
					return startsWith( item.date, value );

				case 'page':
					const page = getDonesPage( state, query, value );
					return includes( page, item.id );

				case 'tag':
					const tag = '#' + value;
					return includes( item.text, tag + ' ' ) || endsWith( item.text, tag );

				default:
					return true;
			}
		} );
	} );
}
