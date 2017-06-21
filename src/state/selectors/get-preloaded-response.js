/**
 * Returns the preloaded response payload for a given path, or null if response
 * is not preloaded. A response payload includes both body and headers.
 *
 * @param  {Object}  state Global state object
 * @param  {string}  path  Path to check
 * @return {?Object}       Preloaded result
 */
export default function getPreloadedResponse( state, path ) {
	const preloaded = state.requests.preload[ path ];
	if ( ! preloaded ) {
		return null;
	}

	const [ response ] = preloaded;
	return response;
}
