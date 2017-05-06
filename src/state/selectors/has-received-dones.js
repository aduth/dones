/**
 * External dependencies
 */
import stringify from 'fast-stable-stringify';

export default function hasReceivedDones( state, query ) {
	return state.dones.totalPages.hasOwnProperty( stringify( query ) );
}
