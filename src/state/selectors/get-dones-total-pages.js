/**
 * External dependencies
 */
import stringify from 'fast-stable-stringify';
import { get, omit } from 'lodash';

export default function getDonesTotalPages( state, query ) {
	query = stringify( omit( query, 'page' ) );
	return get( state.dones.totalPages, query, null );
}
