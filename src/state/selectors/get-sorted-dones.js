/**
 * External dependencies
 */
import { orderBy } from 'lodash';

/**
 * Internal dependencies
 */
import { getDones } from './';

export default function getSortedDones( state, query, property = 'date', order = 'desc' ) {
	return orderBy( getDones( state, query ), property, order );
}
