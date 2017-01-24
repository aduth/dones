/**
 * External dependencies
 */
import stringify from 'fast-stable-stringify';

export default function isRequestingDones( state, query ) {
	return !! state.dones.requesting[ stringify( query ) ];
}
