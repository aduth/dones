/**
 * External dependencies
 */
import { some } from 'lodash';

/**
 * Returns true if a mutative (non-GET) request is currently in flight, or
 * false otherwise.
 *
 * @param  {Object}  state Global state object
 * @return {boolean}       Whether mutative request is in flight
 */
export default function isMutativeRequestInFlight( state ) {
	return some( state.requests.items, ( methods ) => (
		some( methods, ( request, method ) => 'GET' !== method )
	) );
}
