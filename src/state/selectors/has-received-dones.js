/**
 * External dependencies
 */
import stringify from 'fast-stable-stringify';
import { omit } from 'lodash';

export default function hasReceivedDones( state, query ) {
	query = stringify( omit( query, 'page' ) );
	return state.dones.totalPages.hasOwnProperty( query );
}
