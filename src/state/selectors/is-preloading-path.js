/**
 * Returns true if a request is in progress to preload the specified path, or
 * false otherwise.
 *
 * @param  {Object}  state Global state object
 * @param  {String}  path  Request path
 * @return {Boolean}       Whether request is in progress to preload
 */
export default function isPreloadingPath( state, path ) {
	return !! state.requests.preloading[ path ];
}
