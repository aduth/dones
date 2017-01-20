/**
 * External dependencies
 */
import { reduce, startsWith } from 'lodash';

/**
 * Internal dependencies
 */
import { getDones } from './';

export default function getUserDones( state, userId, date ) {
	return reduce( getDones( state ), ( memo, item, id ) => {
		if ( userId !== item.user || ! startsWith( item.date, date ) ) {
			return memo;
		}

		return memo.concat( { ...item, id } );
	}, [] );
}
