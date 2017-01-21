/**
 * External dependencies
 */
import { reduce, every, startsWith } from 'lodash';

export default function getDones( state, query ) {
	return reduce( state.dones.items, ( memo, item, id ) => {
		const isMatch = every( query, ( value, key ) => {
			switch ( key ) {
				case 'userId':
					return item.user === value;

				case 'date':
					return startsWith( item.date, value );
			}
		} );

		if ( isMatch ) {
			memo.push( { ...item, id } );
		}

		return memo;
	}, [] );
}
