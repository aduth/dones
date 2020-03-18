/**
 * Returns true if a request is in progress to preload the specified path, or
 * false otherwise.
 *
 * @param  {Object}  state Global state object
 * @param  {string}  path  Request path
 * @return {boolean}       Whether request is in progress to preload
 */
export default function isPreloadingPath( state, path ) {
	return !! state.requests.preloading[ path ];
}
