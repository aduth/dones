/**
 * External dependencies
 */
import stringify from 'fast-stable-stringify';
import { omit } from 'lodash';

export default function getDonesPage( state, query, page ) {
	const stringified = stringify( omit( query, 'page' ) );
	const pages = state.dones.pages[ stringified ];
	if ( ! pages ) {
		return null;
	}

	return pages[ page - 1 ] || null;
}
