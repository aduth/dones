/**
 * Returns true if navigation has not occurred within the app, or false
 * otherwise.
 *
 * @param  {Object}  state Global state object
 * @return {Boolean}       Whether initial route
 */
export default function isInitialRoute( state ) {
	return state.routing.isInitial;
}
