/**
 * Internal dependencies
 */
import { getRouteByPath } from 'routes';
import { getRoutePath } from './';

/**
 * Returns the route configuration for the current path.
 *
 * @param  {Object} state Global state object
 * @return {Object}       Route configuration
 */
export default function getMatchedRoute( state ) {
	return getRouteByPath( getRoutePath( state ) );
}
