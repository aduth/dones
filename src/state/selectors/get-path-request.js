/**
 * Returns the request object for the specified path, or null if there is no
 * request in progress.
 *
 * @param  {Object}  state Global state object
 * @param  {String}  path  Request path
 * @return {Promise}       Request object
 */
export default function getPathRequest( state, path ) {
	return state.requests.items[ path ] || null;
}
