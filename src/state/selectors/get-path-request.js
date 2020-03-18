/**
 * External dependencies
 */
import { get } from 'lodash';

/**
 * Returns the request object for the specified path, or null if there is no
 * request in progress.
 *
 * @param  {Object}  state  Global state object
 * @param  {string}  path   Request path
 * @param  {?string} method Optional method for path to retrieve
 * @return {Promise}        Request object
 */
export default function getPathRequest( state, path, method = 'GET' ) {
	return get( state.requests.items, [ path, method ], null );
}
