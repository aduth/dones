/**
 * External dependencies
 */
import createSelector from 'rememo';
import stringify from 'fast-stable-stringify';

/**
 * Returns true if the done result has been received for the specified query,
 * or false otherwise (including if a request has not been made).
 *
 * @param  {Object}  state Global state object
 * @param  {Object}  query Query object
 * @return {boolean}       Whether dones have been received
 */
export function hasReceivedDones( state, query ) {
	return !! state.dones.received[ stringify( query ) ];
}

export default createSelector(
	hasReceivedDones,
	( state ) => [ state.dones.received ]
);
