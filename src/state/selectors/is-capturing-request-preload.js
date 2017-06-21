/**
 * Returns true if requests are currently being captured for preload, or false
 * otherwise.
 *
 * @param  {Object}  state Global state object
 * @return {Boolean}       Whether requests are captured for preload
 */
export default function isCapturingRequestPreload( state ) {
	return state.requests.isCapturingPreload;
}
